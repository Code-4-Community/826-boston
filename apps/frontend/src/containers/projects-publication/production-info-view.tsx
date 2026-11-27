import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { ProductionInfo } from '../../types';
import EditableCell from './editable-cell';
import './production-info-view.css';

interface Props {
  anthologyId: number;
  shopifyUrl?: string;
  isbn?: string;
  // Owner, Manager and admins; everyone else sees the values read-only
  canEdit?: boolean;
}

const ProductionInfoView: React.FC<Props> = ({
  anthologyId,
  shopifyUrl: initialShopifyUrl,
  isbn: initialIsbn,
  canEdit = false,
}) => {
  const [productionInfo, setProductionInfo] = useState<ProductionInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [shopifyUrl, setShopifyUrl] = useState(initialShopifyUrl);
  const [isbn, setIsbn] = useState(initialIsbn);

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
      shopifyUrl: value === '' ? null : value,
    });
    setShopifyUrl(updated.shopifyUrl);
  };

  const saveIsbn = async (value: string) => {
    const updated = await apiClient.updateAnthology(anthologyId, {
      isbn: value === '' ? null : value,
    });
    setIsbn(updated.isbn);
  };

  const saveProductionInfoField = async (
    field:
      | 'printedBy'
      | 'bindingType'
      | 'dimensions'
      | 'printRun'
      | 'printingCost',
    rawValue: string,
  ) => {
    const isNumeric = field === 'printRun' || field === 'printingCost';
    const value =
      rawValue === '' ? null : isNumeric ? Number(rawValue) : rawValue;

    const updated = productionInfo
      ? await apiClient.updateProductionInfo(productionInfo.id, {
          [field]: value,
        })
      : await apiClient.createProductionInfo({
          anthologyId,
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
      value: productionInfo?.printedBy ?? null,
      onSave: (value) => saveProductionInfoField('printedBy', value),
    },
    {
      label: 'Binding Type',
      placeholder: 'Add binding type.',
      value: productionInfo?.bindingType ?? null,
      onSave: (value) => saveProductionInfoField('bindingType', value),
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
      value: productionInfo?.printRun ?? null,
      type: 'number',
      requireNonNegative: true,
      onSave: (value) => saveProductionInfoField('printRun', value),
    },
    {
      label: 'Total Printing Cost',
      placeholder: 'Add printing cost.',
      value: productionInfo?.printingCost ?? null,
      type: 'number',
      requireNonNegative: true,
      format: (value) => `$${Number(value).toFixed(2)}`,
      onSave: (value) => saveProductionInfoField('printingCost', value),
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
                  readOnly={!canEdit}
                  onSave={row.onSave}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoView;
