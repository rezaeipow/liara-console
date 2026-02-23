import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ConsoleDataTableContainer from "@/shared/components/common/ConsoleDataTableContainer";
import { formatDateTime, formatIrr } from "../billingFormat";
import type { BillingPaymentsTableProps } from "../types";

export default function BillingPaymentsTable(props: BillingPaymentsTableProps) {
  const { items } = props;

  return (
    <ConsoleDataTableContainer sx={{ display: { xs: "none", lg: "block" } }}>
      <Table size="medium" aria-label="Payments table">
        <caption style={{ textAlign: "left", padding: "8px 16px" }}>
          Billing payments with amount, status, and creation time
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((payment) => (
            <TableRow key={payment.id} hover>
              <TableCell sx={{ fontWeight: 700 }}>{formatIrr(payment.amount)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  icon={payment.status === "success" ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                  color={payment.status === "success" ? "success" : "error"}
                  variant="outlined"
                  label={payment.status === "success" ? "Success" : "Failed"}
                />
              </TableCell>
              <TableCell align="right" sx={{ color: "text.secondary" }}>
                {formatDateTime(payment.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ConsoleDataTableContainer>
  );
}
