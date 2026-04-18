import type { FormEvent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import type { User, TableHeadTypes } from "../../utils/Types";

interface Props {
    disabledField?: string[];
    targetUser?: Partial<User>;
    tableHead: TableHeadTypes[] | null;
    isOpen?: boolean;
    onSend?: (user: User) => void;
    onConfirm?: () => void;
    onClose: () => void;
    title?: string;
    description?: string | null;
    submitText?: string;
    cancelText?: string;
}

const StudentDialog = ({
    disabledField = [],
    targetUser = {},
    tableHead = [],
    isOpen = false,
    onSend,
    onConfirm,
    onClose,
    title = "Title",
    description,
    submitText = "Save",
    cancelText = "Cancel",
}: Props) => {
    //
    // function

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const user: User = {
            id: Number(formJson.id),
            name: String(formJson.name),
            email: String(formJson.email),
            phone: String(formJson.phone),
            address: String(formJson.address),
        };

        console.log(user);

        onSend?.(user);
        onClose();
    };

    // render

    const formBody = tableHead ? (
        <form
            style={{ padding: " 0px 20px 10px" }}
            onSubmit={handleSubmit}
            id="subscription-form"
        >
            {tableHead.map((column) =>
                column.action ? null : (
                    <TextField
                        sx={
                            disabledField?.includes(column.field)
                                ? {
                                      userSelect: "none",
                                      opacity: ".8",
                                      pointerEvents: "none",
                                  }
                                : null
                        }
                        key={column.field}
                        required
                        label={column.text}
                        name={column.field}
                        type={column.formType}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        defaultValue={targetUser?.[column.field] ?? ""}
                    />
                ),
            )}
        </form>
    ) : null;

    return (
        <Dialog open={isOpen}>
            <DialogTitle>{title}</DialogTitle>

            {description ? (
                <DialogContent>
                    <DialogContentText>{description}</DialogContentText>
                </DialogContent>
            ) : null}

            {formBody}

            <DialogActions>
                <Button onClick={onClose}>{cancelText}</Button>
                <Button
                    type="submit"
                    form="subscription-form"
                    onClick={() => {
                        onConfirm?.();
                    }}
                >
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentDialog;
