import { useState } from "react";

const perks = [
  "Add everything your pet needs to your cart",
  "Follow your orders from My Orders",
  "Food, toys and care for every pet",
];

const pets = ["🐶", "🐱", "🐰", "🐦", "🐟"];

export function Field({ id, label, hint, hintOk = false, ...inputProps }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
      {hint && (
        <p className={`auth-hint ${hintOk ? "is-ok" : ""}`}>{hint}</p>
      )}
    </div>
  );
}

export function PasswordField({ id, label, hint, hintOk = false, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>

      <div className="auth-input-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          {...inputProps}
        />

        <button
          type="button"
          className="auth-eye"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {hint && (
        <p className={`auth-hint ${hintOk ? "is-ok" : ""}`}>{hint}</p>
      )}
    </div>
  );
}

function AuthLayout({ title, subtitle, panelTitle, panelText, children }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-panel">
          <div>
            <h2>{panelTitle}</h2>
            <p>{panelText}</p>

            <ul className="auth-perks">
              {perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </div>

          <div className="auth-pets" aria-hidden="true">
            {pets.map((pet) => (
              <span key={pet}>{pet}</span>
            ))}
          </div>
        </aside>

        <section className="auth-form-side">
          <div className="auth-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;