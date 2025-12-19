export default function ThemeButton({
  className = "",
  fontSize = 14,
  onClick = () => {},
  children,
  ...props
}) {
  return (
    <button
      className={`me-3 text-black theme-bg rounded-pill px-3 py-2 font-work-sans btn fw-semibold ${className}`}
      style={{fontSize: fontSize}}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
