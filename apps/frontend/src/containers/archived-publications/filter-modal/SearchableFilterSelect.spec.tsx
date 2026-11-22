import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchableFilterSelect from './SearchableFilterSelect';

const options = [
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'academy', label: 'Technical Academy' },
];

function renderSelect(
  props: Partial<
    React.ComponentProps<typeof SearchableFilterSelect<string>>
  > = {},
) {
  const onChange = vi.fn();
  render(
    <SearchableFilterSelect
      label="Program(s)"
      options={options}
      selected={[]}
      onChange={onChange}
      placeholder="Search for a program..."
      {...props}
    />,
  );
  return { onChange };
}

const searchBox = () => screen.getByLabelText('Program(s)') as HTMLInputElement;
const openList = () => fireEvent.focus(searchBox());
const optionLabels = () =>
  [...document.querySelectorAll('.filter-select-option')].map((o) =>
    o.textContent?.trim(),
  );

describe('SearchableFilterSelect list', () => {
  it('stays closed until the search box is used', () => {
    renderSelect();

    expect(document.querySelector('.filter-select-dropdown')).toBeNull();

    openList();

    expect(optionLabels()).toEqual([
      'Tutoring',
      'Tutorial',
      'Technical Academy',
    ]);
  });

  it('narrows the list as you type, ignoring case', () => {
    renderSelect();

    fireEvent.change(searchBox(), { target: { value: 'TUT' } });

    expect(optionLabels()).toEqual(['Tutoring', 'Tutorial']);
  });

  it('says so when nothing matches', () => {
    renderSelect();

    fireEvent.change(searchBox(), { target: { value: 'zzz' } });

    expect(screen.getByText('No results found')).toBeTruthy();
  });

  it('adds an option when it is clicked', () => {
    const { onChange } = renderSelect();
    openList();

    fireEvent.click(screen.getByRole('button', { name: 'Tutorial' }));

    expect(onChange).toHaveBeenCalledWith(['tutorial']);
  });

  it('removes an option that is already selected when it is clicked again', () => {
    const { onChange } = renderSelect({ selected: ['tutoring', 'tutorial'] });
    openList();

    fireEvent.click(screen.getByRole('button', { name: 'Tutoring' }));

    expect(onChange).toHaveBeenCalledWith(['tutorial']);
  });

  it('works with numeric values such as location ids', () => {
    const onChange = vi.fn();
    render(
      <SearchableFilterSelect
        label="Location(s)"
        options={[
          { value: 3, label: 'Columbus Ave' },
          { value: 7, label: 'Roxbury' },
        ]}
        selected={[3]}
        onChange={onChange}
        placeholder="Search for a location..."
      />,
    );
    fireEvent.focus(screen.getByLabelText('Location(s)'));

    fireEvent.click(screen.getByRole('button', { name: 'Roxbury' }));

    expect(onChange).toHaveBeenCalledWith([3, 7]);
  });

  it('shows a loading note or an error instead of the options', () => {
    renderSelect({ isLoading: true });
    openList();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('shows the error message instead of the options when one is given', () => {
    renderSelect({ errorMessage: "Couldn't load programs. Try again." });
    openList();

    expect(screen.getByText("Couldn't load programs. Try again.")).toBeTruthy();
    expect(optionLabels()).toEqual([]);
  });

  it('closes on Escape', () => {
    renderSelect();
    openList();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.querySelector('.filter-select-dropdown')).toBeNull();
  });

  it('closes on a click outside it', () => {
    renderSelect();
    openList();

    fireEvent.mouseDown(document.body);

    expect(document.querySelector('.filter-select-dropdown')).toBeNull();
  });
});

describe('SearchableFilterSelect selected values', () => {
  it('shows them inside the search box by default and hides the placeholder', () => {
    renderSelect({ selected: ['tutoring'] });

    const tag = document.querySelector('.filter-select-box .filter-select-tag');
    expect(tag?.textContent).toContain('Tutoring');
    expect(document.querySelector('.filter-select-pill')).toBeNull();
    expect(searchBox().placeholder).toBe('');
  });

  it('shows them as pills under the box in pills mode and keeps the placeholder', () => {
    renderSelect({ selected: ['tutoring', 'tutorial'], tagDisplay: 'pills' });

    const pills = [...document.querySelectorAll('.filter-select-pill')].map(
      (pill) => pill.textContent?.trim(),
    );
    expect(pills).toEqual(['Tutoring', 'Tutorial']);
    expect(
      document.querySelector('.filter-select-box .filter-select-pill'),
    ).toBeNull();
    expect(searchBox().placeholder).toBe('Search for a program...');
  });

  it('removes a value with the X on its pill', () => {
    const { onChange } = renderSelect({
      selected: ['tutoring', 'tutorial'],
      tagDisplay: 'pills',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Tutoring' }));

    expect(onChange).toHaveBeenCalledWith(['tutorial']);
  });

  it('lines the label up with the box only while pills are showing', () => {
    renderSelect({ selected: ['tutoring'], tagDisplay: 'pills' });
    expect(
      document.querySelector('.filter-select-row--with-pills'),
    ).not.toBeNull();
  });

  it('does not add the pills layout when nothing is selected', () => {
    renderSelect({ tagDisplay: 'pills' });

    expect(document.querySelector('.filter-select-row--with-pills')).toBeNull();
    expect(document.querySelector('.filter-select-pills')).toBeNull();
  });

  it('uses the given search icon', () => {
    renderSelect({ searchIconSrc: '/custom-search.svg' });

    const icon = document.querySelector('.filter-select-search-icon');
    expect(icon?.getAttribute('src')).toBe('/custom-search.svg');
  });
});
