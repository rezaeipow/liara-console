import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { NewTicketFormFieldsProps } from "../types";

export default function NewTicketFormFields(props: NewTicketFormFieldsProps) {
  const {
    categories,
    actionData,
    subject,
    category,
    body,
    isCompact,
    onSubjectChange,
    onCategoryChange,
    onBodyChange,
  } = props;

  return (
    <>
      <FormControl size="small" error={Boolean(actionData?.fieldErrors?.subject)}>
        <InputLabel htmlFor="support-ticket-subject">Subject</InputLabel>
        <OutlinedInput
          id="support-ticket-subject"
          name="subject"
          label="Subject"
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          placeholder="Example: Deployment failed after pushing commit"
          inputProps={{ "aria-label": "Ticket subject", maxLength: 120 }}
        />
        <FormHelperText>
          {actionData?.fieldErrors?.subject ?? `A short title helps faster triage (${subject.length}/120)`}
        </FormHelperText>
      </FormControl>

      <FormControl size="small" error={Boolean(actionData?.fieldErrors?.category)}>
        <InputLabel id="support-ticket-category-label">Category</InputLabel>
        <Select
          labelId="support-ticket-category-label"
          id="support-ticket-category"
          name="category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          label="Category"
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{actionData?.fieldErrors?.category ?? "Choose the most relevant area."}</FormHelperText>
      </FormControl>

      <FormControl size="small" error={Boolean(actionData?.fieldErrors?.body)}>
        <InputLabel htmlFor="support-ticket-body">Description</InputLabel>
        <OutlinedInput
          id="support-ticket-body"
          name="body"
          label="Description"
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          multiline
          minRows={isCompact ? 4 : 6}
          placeholder="What happened? What did you expect? Include key details."
          inputProps={{ "aria-label": "Ticket description", maxLength: 2000 }}
        />
        <FormHelperText>
          {actionData?.fieldErrors?.body ?? `Include steps and exact error text if available (${body.length}/2000)`}
        </FormHelperText>
      </FormControl>
    </>
  );
}
