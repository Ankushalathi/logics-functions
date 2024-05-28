import Dialog from "@mui/material/Dialog";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { ExpenseCategoryFormValues } from "src/models/ExpenseCategory.model";
import { useAddAccountsMutation } from "src/services/AccountsService";
import { showToast } from "src/utils/showToaster";
import { object, string } from "yup";
import AddFeatureForm from "./AddFeatureForm";

type Props = {
  onClose: () => void;
};

const AddFeatureWrapper = ({ onClose }: Props) => {
  const [saveNextChecked, setSaveNextChecked] = useState<boolean>(true);
  const [addExpenseCategory] = useAddAccountsMutation();

  // Form Initial Values
  const initialValues: ExpenseCategoryFormValues = {
    title: "",

  };

  // Validation Schema
  const validationSchema = object().shape({
    title: string().required("Please enter account name"),

  });

  // Handle Submit
  const handleSubmit = (
    values: ExpenseCategoryFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ExpenseCategoryFormValues>
  ) => {

    const formattedValues = {
      accountName: values?.title,
    };

    addExpenseCategory(formattedValues).then((res: any) => {
      if (res?.error) {
        showToast("error", res?.error?.data?.message);
      } else {
        if (res?.data?.status) {
          showToast("success", res?.data?.message);
          if (!saveNextChecked) {
            resetForm();
            onClose();
          }
        } else {
          showToast("error", res?.data?.message);
        }
      }
      setSubmitting(false);
    });
  };

  return (
    <Dialog open maxWidth="xs" fullWidth fullScreen={isMobile}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <AddFeatureForm
              formType="ADD"
              setSaveNextChecked={setSaveNextChecked}
              saveNextChecked={saveNextChecked}
              formikProps={formikProps}
              onClose={onClose}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddFeatureWrapper;
