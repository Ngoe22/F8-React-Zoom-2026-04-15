import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import { Button } from "@mui/material";
import type { User, TableHeadTypes } from "../../utils/Types";

const styles = {
    table: {
        width: "95%",
        margin: " 0 auto 0",
        boxShadow: "-1px 1px 3px 3px rgba(0, 0, 0, 0.12)",
    },
    addBtn: {
        display: "block",
        width: "95%",
        margin: "5px auto 0",
        opacity: ".6",
        fontWeight: "600",
    },
};

interface tableProps {
    users: User[];
    tableHead: TableHeadTypes[];
    onAdd: () => void;
}

function MyTable({ users, tableHead, onAdd }: tableProps) {
    return (
        <>
            <Table sx={styles.table}>
                <TableHead>
                    <TableRow>
                        {tableHead.map((column) => (
                            <TableCell key={column.field}>
                                {column.action ? "" : column.text}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((user) => {
                        return (
                            <TableRow key={user.id}>
                                {tableHead.map((column) => (
                                    <TableCell key={column.field}>
                                        {column.action ? (
                                            <Button
                                                onClick={() => {
                                                    if (column.onclickBtn)
                                                        column.onclickBtn(user);
                                                }}
                                                sx={column.ownStyles}
                                            >
                                                {column.text}
                                            </Button>
                                        ) : (
                                            user[column.field]
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Button onClick={onAdd} variant="outlined" sx={styles.addBtn}>
                Add
            </Button>
        </>
    );
}

export default MyTable;

// ======================= CURD =======================
