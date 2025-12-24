export default function SelectPicker({
  id,
  name,
  label,
  value,
  onChangeFn,
  divSpacing = "mb-3",
  children,
}) {
  return (
    <div className={divSpacing}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChangeFn}
        className="form-control selectpicker bg-light rounded-4 fs-sm-14"
        data-live-search="true"
      >
        {children}
      </select>
    </div>
  );
}
