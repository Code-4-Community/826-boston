import DatePickerField from './DatePickerField';
import RangeDashIcon from '../../../assets/icons/range-dash.svg';

interface DateRangeFilterRowProps {
  label: string;
  /** yyyy-mm-dd, or '' when the bound is not set. */
  startValue: string;
  endValue: string;
  onStartChange: (iso: string) => void;
  onEndChange: (iso: string) => void;
  /** When set, shown under the dates and both boxes are outlined in red. */
  errorMessage?: string;
}

export default function DateRangeFilterRow({
  label,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  errorMessage,
}: DateRangeFilterRowProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className="filter-date-group">
      <div className="filter-date-row">
        <span className="filter-select-label">{label}</span>
        <DatePickerField
          value={startValue}
          onChange={onStartChange}
          ariaLabel={`${label} start`}
          hasError={hasError}
        />
        <img src={RangeDashIcon} alt="" className="filter-date-dash" />
        <DatePickerField
          value={endValue}
          onChange={onEndChange}
          ariaLabel={`${label} end`}
          hasError={hasError}
        />
      </div>

      {errorMessage && (
        <p className="filter-date-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
