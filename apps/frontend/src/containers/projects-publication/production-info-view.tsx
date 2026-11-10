import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../../api/apiClient';
import Role from '../../api/dtos/role';
import { Anthology, ProductionInfo } from '../../types';
import { useCanEditAnthology } from '../../hooks/useCanEditAnthology';
import './production-info-view.css';

interface Props {
  anthologyId: number;
  shopifyUrl?: string;
  isbn?: string;
  releaseFormsOnFile?: boolean;
  releaseFormsUrl?: string | null;
  currentUser?: { id: number; role: Role | string };
  /** Called after release forms change so the status menu stays in sync. */
  onAnthologyChange?: (anthology: Anthology) => void;
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = (
      err.response?.data as { message?: string | string[] } | undefined
    )?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
    return err.message;
  }
  return 'Something went wrong.';
}

interface EditableCellProps {
  value: string | number | null;
  placeholder: string;
  type?: 'text' | 'number';
  format?: (value: string | number) => string;
  requireNonNegative?: boolean;
  onSave: (newValue: string) => Promise<void>;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  placeholder,
  type = 'text',
  format,
  requireNonNegative,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalText = value != null ? String(value) : '';

  const startEditing = () => {
    setError(null);
    setDraft(originalText);
    setIsEditing(true);
  };

  const commit = async () => {
    const trimmed = draft.trim();

    if (trimmed === originalText) {
      setIsEditing(false);
      return;
    }

    if (type === 'number' && trimmed !== '') {
      const parsed = Number(trimmed);

      if (Number.isNaN(parsed)) {
        setError('Enter a number.');
        return;
      }

      if (requireNonNegative && parsed < 0) {
        setError('Number must be non-negative.');
        return;
      }
    }

    setSaving(true);
    try {
      await onSave(trimmed);
      setIsEditing(false);
    } catch (err) {
      setError(`Failed to save: ${getErrorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="production-info-edit">
        <input
          className="production-info-input"
          type={type}
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
        />
        {error && <span className="production-info-error">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="production-info-cell"
      onClick={startEditing}
    >
      {value != null ? (
        format ? (
          format(value)
        ) : (
          value
        )
      ) : (
        <span className="production-info-placeholder">{placeholder}</span>
      )}
    </button>
  );
};

const ProductionInfoView: React.FC<Props> = ({
  anthologyId,
  shopifyUrl: initialShopifyUrl,
  isbn: initialIsbn,
  releaseFormsOnFile,
  releaseFormsUrl,
  currentUser,
  onAnthologyChange,
}) => {
  const [productionInfo, setProductionInfo] = useState<ProductionInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [shopifyUrl, setShopifyUrl] = useState(initialShopifyUrl);
  const [isbn, setIsbn] = useState(initialIsbn);

  // Release forms: only Owners/Managers (and admins) can change them
  const canEditReleaseForms = useCanEditAnthology(anthologyId, currentUser);
  const [formsOnFile, setFormsOnFile] = useState(!!releaseFormsOnFile);
  const [formsUrl, setFormsUrl] = useState(releaseFormsUrl ?? '');
  const [formsSaving, setFormsSaving] = useState(false);
  const [formsError, setFormsError] = useState<string | null>(null);

  useEffect(() => {
    setFormsOnFile(!!releaseFormsOnFile);
  }, [releaseFormsOnFile]);

  useEffect(() => {
    setFormsUrl(releaseFormsUrl ?? '');
  }, [releaseFormsUrl]);

  const saveReleaseForms = async (body: Record<string, unknown>) => {
    setFormsSaving(true);
    try {
      const updated = await apiClient.updateAnthology(anthologyId, body);
      setFormsOnFile(!!updated.releaseFormsOnFile);
      setFormsUrl(updated.releaseFormsUrl ?? '');
      onAnthologyChange?.(updated);
    } finally {
      setFormsSaving(false);
    }
  };

  const toggleReleaseForms = async (checked: boolean) => {
    setFormsError(null);
    try {
      await saveReleaseForms({ releaseFormsOnFile: checked });
    } catch (err) {
      setFormsError(`Failed to save: ${getErrorMessage(err)}`);
    }
  };

  // EditableCell shows its own error if this throws
  const saveReleaseFormsUrl = (value: string) =>
    saveReleaseForms({ releaseFormsUrl: value === '' ? null : value });

  useEffect(() => {
    setShopifyUrl(initialShopifyUrl);
  }, [initialShopifyUrl]);

  useEffect(() => {
    setIsbn(initialIsbn);
  }, [initialIsbn]);

  useEffect(() => {
    apiClient
      .getProductionInfo(anthologyId)
      .then((data) => {
        setProductionInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [anthologyId]);

  const saveShopifyUrl = async (value: string) => {
    const updated = await apiClient.updateAnthology(anthologyId, {
      shopify_url: value === '' ? null : value,
    });
    setShopifyUrl(updated.shopify_url || updated.shopifyUrl);
  };

  const saveIsbn = async (value: string) => {
    const updated = await apiClient.updateAnthology(anthologyId, {
      isbn: value === '' ? null : value,
    });
    setIsbn(updated.isbn);
  };

  const saveProductionInfoField = async (
    field:
      | 'printed_by'
      | 'binding_type'
      | 'dimensions'
      | 'print_run'
      | 'printing_cost',
    rawValue: string,
  ) => {
    const isNumeric = field === 'print_run' || field === 'printing_cost';
    const value =
      rawValue === '' ? null : isNumeric ? Number(rawValue) : rawValue;

    const updated = productionInfo
      ? await apiClient.updateProductionInfo(productionInfo.id, {
          [field]: value,
        })
      : await apiClient.createProductionInfo({
          anthology_id: anthologyId,
          [field]: value,
        });

    setProductionInfo(updated);
  };

  if (loading) return <div className="production-info-loading">Loading...</div>;

  const rows: {
    label: string;
    placeholder: string;
    value: string | number | null;
    type?: 'text' | 'number';
    format?: (value: string | number) => string;
    requireNonNegative?: boolean;
    onSave: (value: string) => Promise<void>;
  }[] = [
    {
      label: 'Shopify URL',
      placeholder: 'Add URL.',
      value: shopifyUrl || null,
      onSave: saveShopifyUrl,
    },
    {
      label: 'Printer',
      placeholder: 'Add printer.',
      value: productionInfo?.printed_by ?? null,
      onSave: (value) => saveProductionInfoField('printed_by', value),
    },
    {
      label: 'Binding Type',
      placeholder: 'Add binding type.',
      value: productionInfo?.binding_type ?? null,
      onSave: (value) => saveProductionInfoField('binding_type', value),
    },
    {
      label: 'Book Dimensions',
      placeholder: 'Add book dimensions.',
      value: productionInfo?.dimensions ?? null,
      onSave: (value) => saveProductionInfoField('dimensions', value),
    },
    {
      label: '# of Copies Printed',
      placeholder: 'Add # of copies.',
      value: productionInfo?.print_run ?? null,
      type: 'number',
      requireNonNegative: true,
      onSave: (value) => saveProductionInfoField('print_run', value),
    },
    {
      label: 'Total Printing Cost',
      placeholder: 'Add printing cost.',
      value: productionInfo?.printing_cost ?? null,
      type: 'number',
      requireNonNegative: true,
      format: (value) => `$${Number(value).toFixed(2)}`,
      onSave: (value) => saveProductionInfoField('printing_cost', value),
    },
    {
      label: 'ISBN',
      placeholder: 'Add ISBN.',
      value: isbn || null,
      onSave: saveIsbn,
    },
  ];

  return (
    <div>
      <table className="production-info-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>
                <EditableCell
                  value={row.value}
                  placeholder={row.placeholder}
                  type={row.type}
                  format={row.format}
                  requireNonNegative={row.requireNonNegative}
                  onSave={row.onSave}
                />
              </td>
            </tr>
          ))}
          <tr>
            <th>Release Forms</th>
            <td>
              <label className="production-info-release-forms">
                <input
                  type="checkbox"
                  checked={formsOnFile}
                  disabled={!canEditReleaseForms || formsSaving}
                  onChange={(event) =>
                    void toggleReleaseForms(event.target.checked)
                  }
                />
                Release forms on file
              </label>
              {formsError && (
                <span className="production-info-error">{formsError}</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Release Forms Link</th>
            <td>
              {canEditReleaseForms ? (
                <EditableCell
                  value={formsUrl || null}
                  placeholder="Add link (optional)."
                  onSave={saveReleaseFormsUrl}
                />
              ) : formsUrl ? (
                <a href={formsUrl} target="_blank" rel="noreferrer">
                  {formsUrl}
                </a>
              ) : (
                <span className="production-info-placeholder">—</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoView;
