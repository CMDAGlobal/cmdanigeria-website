import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/site/primitives";
import {
  COUNTRIES,
  CURRENCY_OPTIONS,
  CURRENCY_SYMBOLS,
  FREQUENCY_OPTIONS,
  GLOBAL_CATEGORIES,
  GLOBAL_PAYMENT_OPTIONS,
  NIGERIA_AREAS,
  NIGERIA_PAYMENT_OPTIONS,
  REGION_OPTIONS,
  groupThousands,
  joinList,
  parseAmount,
  type GiveSelectOption,
} from "@/components/site/give-data";

const labelClass = "text-sm font-semibold";
const smallLabelClass = "text-xs font-semibold text-muted-foreground";
const inputClass =
  "mt-2 h-11 w-full rounded-md border border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const readonlyClass =
  "mt-2 h-11 w-full cursor-default rounded-md border border-input bg-muted px-4 text-sm font-semibold";
const radioClass = "size-4 shrink-0 accent-cmda-green";
const checkboxClass = "mt-0.5 size-4 shrink-0 accent-cmda-green";

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: GiveSelectOption[];
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option
            key={`${option.value}-${option.label}`}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SuccessCard({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-border bg-card p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cmda-green text-primary-foreground">
        <Check className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">
        Thank you for your generosity!
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link to="/give" className={buttonVariants({ variant: "primary" })}>
          Back to give options
        </Link>
        <button type="button" className={buttonVariants({ variant: "outline" })} onClick={onReset}>
          Submit another response
        </button>
      </div>
    </div>
  );
}

export function DonationForm({ variant }: { variant: "donation" | "pledge" }) {
  const prefix = variant === "donation" ? "dn" : "pl";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [frequency, setFrequency] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ message: string } | null>(null);

  const selected = NIGERIA_AREAS.filter((area) => checked[area.value]);
  const total = selected.reduce((sum, area) => sum + parseAmount(amounts[area.value]), 0);

  function toggleArea(value: string) {
    setChecked((prev) => ({ ...prev, [value]: !prev[value] }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected.length === 0) {
      setError("Choose at least one area of need to support.");
      return;
    }
    if (total <= 0) {
      setError("Enter an amount for at least one chosen area.");
      return;
    }
    setError(null);
    const gift = `₦${groupThousands(total)}`;
    const areas = joinList(selected.map((area) => area.label));
    setSubmitted({
      message:
        variant === "donation"
          ? `Your gift of ${gift} to ${areas} has been recorded. Our team will contact you shortly with the next steps to complete your gift.`
          : `Your pledge of ${gift} to ${areas} has been recorded. Our team will contact you shortly to confirm your pledge and share giving details.`,
    });
  }

  if (submitted) {
    return <SuccessCard message={submitted.message} onReset={() => setSubmitted(null)} />;
  }

  return (
    <form
      aria-label={
        variant === "donation" ? "CMDA Nigeria donation form" : "CMDA Nigeria pledge form"
      }
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${prefix}-first-name`}
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="First Name"
          autoComplete="given-name"
        />
        <Field
          id={`${prefix}-last-name`}
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Last Name"
          autoComplete="family-name"
        />
        <Field
          id={`${prefix}-email`}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Email Address"
          autoComplete="email"
        />
        <Field
          id={`${prefix}-phone`}
          label="Phone/Mobile"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="Mobile Number"
          autoComplete="tel"
        />
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>Donation Frequency</legend>
        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
          {FREQUENCY_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2.5 text-sm font-medium">
              <input
                type="radio"
                name={`${prefix}-frequency`}
                value={option.value}
                required
                checked={frequency === option.value}
                onChange={() => setFrequency(option.value)}
                className={radioClass}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className={labelClass}>Areas of Need</legend>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          {NIGERIA_AREAS.map((area, index) => (
            <div key={area.value}>
              <label className="flex items-start gap-3 text-sm font-medium leading-snug">
                <input
                  type="checkbox"
                  checked={checked[area.value] ?? false}
                  onChange={() => toggleArea(area.value)}
                  className={checkboxClass}
                />
                <span>{area.label}</span>
              </label>
              {checked[area.value] ? (
                <div className="mt-3 pl-7">
                  <label htmlFor={`${prefix}-amount-${index}`} className={smallLabelClass}>
                    {area.amountLabel} (₦)
                  </label>
                  <input
                    id={`${prefix}-amount-${index}`}
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="0"
                    value={amounts[area.value] ?? ""}
                    onChange={(event) =>
                      setAmounts((prev) => ({ ...prev, [area.value]: event.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${prefix}-total`} className={labelClass}>
          Total Donation Amount (₦)
        </label>
        <input
          id={`${prefix}-total`}
          readOnly
          value={groupThousands(total)}
          className={readonlyClass}
        />
      </div>

      {variant === "donation" ? (
        <div className="mt-5">
          <SelectField
            id={`${prefix}-payment`}
            label="Payment Method"
            value={payment}
            onChange={setPayment}
            options={NIGERIA_PAYMENT_OPTIONS}
          />
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full">
        Submit
      </Button>
    </form>
  );
}

export function GlobalNetworkForm() {
  const [firstTime, setFirstTime] = useState("");
  const [donorId, setDonorId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [payment, setPayment] = useState("");
  const [currency, setCurrency] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [region, setRegion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ message: string } | null>(null);

  const selected = GLOBAL_CATEGORIES.filter((category) => checked[category.value]);
  const total = selected.reduce((sum, category) => sum + parseAmount(amounts[category.value]), 0);
  const showRegion = checked["Regional Meeting"] ?? false;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";

  function toggleCategory(value: string) {
    setChecked((prev) => ({ ...prev, [value]: !prev[value] }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected.length === 0) {
      setError("Choose at least one category of donation.");
      return;
    }
    if (total <= 0) {
      setError("Enter an amount for at least one chosen category.");
      return;
    }
    setError(null);
    const categories = joinList(selected.map((category) => category.label));
    setSubmitted({
      message: `Your gift of ${symbol}${groupThousands(total)} to ${categories} has been recorded. Our team will contact you shortly with the next steps to complete your gift.`,
    });
  }

  if (submitted) {
    return <SuccessCard message={submitted.message} onReset={() => setSubmitted(null)} />;
  }

  return (
    <form
      aria-label="CMDA global donation form"
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-8"
    >
      <fieldset>
        <legend className={labelClass}>Are You a First Time Donor?</legend>
        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2.5 text-sm font-medium">
              <input
                type="radio"
                name="gl-first-time"
                value={option.value}
                required
                checked={firstTime === option.value}
                onChange={() => setFirstTime(option.value)}
                className={radioClass}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {firstTime === "no" ? (
        <div className="mt-5">
          <Field
            id="gl-donor-id"
            label="Email or CMDA Unique ID"
            value={donorId}
            onChange={setDonorId}
            placeholder="Provide your Email Address or CMDA Unique ID"
          />
        </div>
      ) : null}

      {firstTime === "yes" ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="gl-first-name"
              label="First Name"
              value={firstName}
              onChange={setFirstName}
              placeholder="First Name"
              autoComplete="given-name"
            />
            <Field
              id="gl-last-name"
              label="Last Name"
              value={lastName}
              onChange={setLastName}
              placeholder="Last Name"
              autoComplete="family-name"
            />
            <Field
              id="gl-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email Address"
              autoComplete="email"
            />
            <Field
              id="gl-phone"
              label="Phone/Mobile"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Mobile Number"
              autoComplete="tel"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="gl-country" className={labelClass}>
              Country/Region
            </label>
            <select
              id="gl-country"
              required
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select Country
              </option>
              {COUNTRIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SelectField
          id="gl-payment"
          label="Payment Method"
          value={payment}
          onChange={setPayment}
          options={GLOBAL_PAYMENT_OPTIONS}
        />
        <SelectField
          id="gl-currency"
          label="Donation Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCY_OPTIONS}
        />
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>Category of Donation</legend>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          {GLOBAL_CATEGORIES.map((category, index) => (
            <div key={category.value}>
              <label className="flex items-start gap-3 text-sm font-medium leading-snug">
                <input
                  type="checkbox"
                  checked={checked[category.value] ?? false}
                  onChange={() => toggleCategory(category.value)}
                  className={checkboxClass}
                />
                <span>{category.label}</span>
              </label>
              {category.amountLabel && checked[category.value] ? (
                <div className="mt-3 pl-7">
                  <label htmlFor={`gl-amount-${index}`} className={smallLabelClass}>
                    {category.amountLabel}
                  </label>
                  <input
                    id={`gl-amount-${index}`}
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="0"
                    value={amounts[category.value] ?? ""}
                    onChange={(event) =>
                      setAmounts((prev) => ({ ...prev, [category.value]: event.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>

      {showRegion ? (
        <div className="mt-5">
          <SelectField
            id="gl-region"
            label="Select Region"
            value={region}
            onChange={setRegion}
            options={REGION_OPTIONS}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <label htmlFor="gl-total" className={labelClass}>
          Total Donation Amount
        </label>
        <input
          id="gl-total"
          readOnly
          value={symbol ? `${symbol}${groupThousands(total)}` : groupThousands(total)}
          className={readonlyClass}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full">
        Submit
      </Button>
    </form>
  );
}
