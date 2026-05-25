import styles from "./Button.module.css"

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button
