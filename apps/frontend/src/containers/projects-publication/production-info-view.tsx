import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { ProductionInfo } from '../../types';
import './production-info-view.css';

interface Props {
  anthologyId: number;
}

interface FieldMeta {
  label: string;
  render: (info: ProductionInfo) => React.ReactNode;
}

const FIELDS: FieldMeta[] = [
  {
    label: 'Design Files Link',
    render: (info) =>
      info.design_files_link ? (
        <a href={info.design_files_link} target="_blank" rel="noreferrer">
          Open
        </a>
      ) : (
        '—'
      ),
  },
  {
    label: 'Cover Image File Link',
    render: (info) =>
      info.cover_image_file_link ? (
        <a href={info.cover_image_file_link} target="_blank" rel="noreferrer">
          Open
        </a>
      ) : (
        '—'
      ),
  },
  { label: 'Binding Type', render: (info) => info.binding_type ?? '—' },
  { label: 'Dimensions', render: (info) => info.dimensions ?? '—' },
  {
    label: 'Printing Cost',
    render: (info) =>
      info.printing_cost != null ? `$${info.printing_cost.toFixed(2)}` : '—',
  },
  { label: 'Print Run', render: (info) => info.print_run ?? '—' },
  {
    label: 'Weight',
    render: (info) =>
      info.weight_in_grams != null ? `${info.weight_in_grams} g` : '—',
  },
  { label: 'Page Count', render: (info) => info.page_count ?? '—' },
  { label: 'Printed By', render: (info) => info.printed_by ?? '—' },
];

const ProductionInfoView: React.FC<Props> = ({ anthologyId }) => {
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

  if (!productionInfo)
    return (
      <div className="production-info-empty">
        No production info has been added for this anthology yet.
      </div>
    );

  return (
    <table className="production-info-table">
      <tbody>
        {FIELDS.map((field) => (
          <tr key={field.label}>
            <th>{field.label}</th>
            <td>{field.render(productionInfo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductionInfoView;
