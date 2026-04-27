import { zodResolver } from "@hookform/resolvers/zod";
import Button, { ButtonType, ButtonVariant } from "components/Button";
import Checkbox from "components/Checkbox";
import Input from "components/Input";
import PlusIcon from "images/plus.svg";
import TrashIcon from "images/trash.svg";
import { FormDataDTO } from "models/FormDataDTO";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .min(1, "E-mail is required.")
    .max(255, "E-mail must be at most 255 characters.")
    .email("Please enter a valid e-mail address."),
  clinic: z.array(
    z.object({
      value: z.string().max(255, "Address line must be at most 255 characters."),
    })
  ),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: FormDataDTO) => void;
};

const MAX_ADDRESS_LINES = 3;

const NewsletterSignupForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      clinic: [{ value: "" }],
      acceptedTerms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clinic",
  });

  const acceptedTerms = watch("acceptedTerms");
  const canAddAnotherLine = fields.length < MAX_ADDRESS_LINES;

  const onValidSubmit = (data: FormValues) => {
    onSubmit({
      email: data.email.trim(),
      clinic: data.clinic.map((c) => c.value.trim()),
      acceptedTerms: data.acceptedTerms,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <Input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Enter e-mail"
        label="E-mail*"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="flex flex-col gap-3">
        {fields.map((field, i) => {
          const label =
            i === 0 ? "Clinic - Address line 1" : `Address line ${i + 1}`;
          const placeholder =
            i === 0 ? "Enter clinic name and address" : "Enter clinic name";

          const endAdornment =
            i > 0 ? (
              <Button
                label={`Remove address line ${i + 1}`}
                variant={ButtonVariant.Tertiary}
                className="text-grey-0150 hover:text-grey-0250"
                onClick={() => remove(i)}
              >
                <TrashIcon className="w-6 h-6" />
              </Button>
            ) : null;

          return (
            <Input
              key={field.id}
              label={label}
              error={errors.clinic?.[i]?.value?.message}
              id={`clinic-${i}`}
              type="text"
              placeholder={placeholder}
              endAdornment={endAdornment}
              {...register(`clinic.${i}.value`)}
            />
          );
        })}

        <Button
          label="Add another line"
          variant={ButtonVariant.Tertiary}
          onClick={() => append({ value: "" })}
          disabled={!canAddAnotherLine}
        >
          <PlusIcon className="w-3 h-3" />
          Add another line
        </Button>
      </div>
      <div>
        <Checkbox
          checked={acceptedTerms}
          error={errors.acceptedTerms?.message}
          {...register("acceptedTerms")}
        >
          By submitting this form, you agree to receive marketing communications
          from Oticon A/S regarding our products, services, promotions, and
          events by email and/or by phone. You can unsubscribe at any time by
          clicking the unsubscribe link, or by sending an email to
          privacy@demant.com, or by entering us via phone call. If you want to
          learn more about how we process your data, please see Privacy policy.
        </Checkbox>
      </div>
      <div>
        <Button
          label="Submit"
          type={ButtonType.Submit}
          variant={ButtonVariant.Primary}
          className="w-full min-w-[128px]"
        />
      </div>
    </form>
  );
};

export default NewsletterSignupForm;
