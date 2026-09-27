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

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Shopify URL',
      value: shopifyUrl ? (
        <a href={shopifyUrl} target="_blank" rel="noreferrer">
          {shopifyUrl}
        </a>
      ) : (
        '—'
      ),
    },
    { label: 'Printer', value: productionInfo?.printed_by ?? '—' },
    { label: 'Binding Type', value: productionInfo?.binding_type ?? '—' },
    { label: 'Book Dimensions', value: productionInfo?.dimensions ?? '—' },
    {
      label: '# of Copies Printed',
      value: productionInfo?.print_run ?? '—',
    },
    {
      label: 'Total Printing Cost',
      value:
        productionInfo?.printing_cost != null
          ? `$${productionInfo.printing_cost.toFixed(2)}`
          : '—',
    },
    { label: 'ISBN', value: isbn ?? '—' },
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
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoView;
