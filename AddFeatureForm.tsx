import { FormikProps } from "formik";
import ATMLoadingButton from "src/components/UI/atoms/ATMLoadingButton/ATMLoadingButton";
import ATMCheckbox from "src/components/UI/atoms/formFields/ATMCheckbox/ATMCheckbox";
import ATMTextField from "src/components/UI/atoms/formFields/ATMTextField/ATMTextField";
import { ExpenseCategoryFormValues } from "src/models/ExpenseCategory.model";

type Props = {
  formikProps: FormikProps<ExpenseCategoryFormValues>;
  onClose: () => void;
  formType: "ADD" | "EDIT";
  setSaveNextChecked?: any;
  saveNextChecked?: any;
};

const AddFeatureForm = ({
  formType = "ADD",
  formikProps,
  onClose,
  setSaveNextChecked,
  saveNextChecked,
}: Props) => {
  const formHeading = formType === "ADD" ? "Add Feature" : "Update Feature";
  const { values, setFieldValue, isSubmitting, handleBlur } = formikProps;

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium"> {formHeading} </div>
        <button
          type="button"
          className="hover:bg-hover p-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {/* Organisation Name */}
        <div>
          <ATMTextField
            required
            name="title"
            value={values.title}
            onChange={(e) => setFieldValue("title", e.target.value)}
            label="Feature"
            placeholder="Enter Feature"
            onBlur={handleBlur}
          />
        </div>

      </div>
      {formType === "ADD" && (
        <div>
          <ATMCheckbox
            label="Save and Next"
            checked={saveNextChecked}
            inputClasses="h-[15px]"
            labelClasses="text-sm select-none"
            onChange={(checked) => {
              setSaveNextChecked(checked);
            }}
          />
        </div>
      )}
      <div>
        <ATMLoadingButton isLoading={isSubmitting} type="submit">
          Save
        </ATMLoadingButton>
      </div>
    </div>
  );
};

export default AddFeatureForm;
