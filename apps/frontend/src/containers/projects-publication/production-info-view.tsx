import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { ProductionInfo } from '../../types';
import './production-info-view.css';

interface Props {
  anthologyId: number;
  shopifyUrl?: string;
  isbn?: string;
}

const ProductionInfoView: React.FC<Props> = ({
  anthologyId,
  shopifyUrl,
  isbn,
}) => {
  const [productionInfo, setProductionInfo] = useState<ProductionInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getProductionInfo(anthologyId)
      .then((data) => {
        setProductionInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [anthologyId]);

  if (loading) return <div className="production-info-loading">Loading...</div>;

  const rows: {
    label: string;
    value: React.ReactNode | null;
    placeholder: string;
  }[] = [
    {
      label: 'Shopify URL',
      placeholder: 'Add URL.',
      value: shopifyUrl ? (
        <a href={shopifyUrl} target="_blank" rel="noreferrer">
          {shopifyUrl}
        </a>
      ) : null,
    },
    {
      label: 'Printer',
      placeholder: 'Add printer.',
      value: productionInfo?.printed_by ?? null,
    },
    {
      label: 'Binding Type',
      placeholder: 'Add binding type.',
      value: productionInfo?.binding_type ?? null,
    },
    {
      label: 'Book Dimensions',
      placeholder: 'Add book dimensions.',
      value: productionInfo?.dimensions ?? null,
    },
    {
      label: '# of Copies Printed',
      placeholder: 'Add # of copies.',
      value: productionInfo?.print_run ?? null,
    },
    {
      label: 'Total Printing Cost',
      placeholder: 'Add printing cost.',
      value:
        productionInfo?.printing_cost != null
          ? `$${productionInfo.printing_cost.toFixed(2)}`
          : null,
    },
    {
      label: 'ISBN',
      placeholder: 'Add ISBN.',
      value: isbn ?? null,
    },
  ];

  return (
    <div>
      {!productionInfo && (
        <p className="production-info-empty">
          No production info has been added for this anthology yet.
        </p>
      )}
      <table className="production-info-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>
                {row.value != null ? (
                  row.value
                ) : (
                  <span className="production-info-placeholder">
                    {row.placeholder}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoView;
