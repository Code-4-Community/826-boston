import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { ProductionInfo } from '../../types';
import EditableCell from './editable-cell';
import './production-info-view.css';

interface Props {
  anthologyId: number;
  shopifyUrl?: string;
  isbn?: string;
}

const ProductionInfoView: React.FC<Props> = ({
  anthologyId,
  shopifyUrl: initialShopifyUrl,
  isbn: initialIsbn,
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
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoView;
