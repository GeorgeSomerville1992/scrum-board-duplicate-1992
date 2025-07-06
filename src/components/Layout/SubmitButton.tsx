interface SubmitButtonProps {
  text: string;
}

export const SubmitButton = ({ text }: SubmitButtonProps) => (
  <button className="bg-button-primary text-white pl-4 pr-4 pt-2 pb-2 rounded-lg" type="submit">
    {text}
  </button>
);
