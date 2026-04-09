export default function AuthLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        {children}
      </div>
    </div>
  );
}
