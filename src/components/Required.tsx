/** Visual "required" marker. Inputs carry the `required` attribute, which screen readers announce. */
export default function Required() {
  return (
    <span className="text-red-600" aria-hidden="true">
      *
    </span>
  );
}
