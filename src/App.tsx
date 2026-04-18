import "./App.css";
import { useState, useEffect } from "react";
import MyTable from "./components/MyTable";
import MyDialog from "./components/MyDialog";

import type { User } from "./utils/Types";

interface ModalType {
    type: string;
    target: User;
}
//  ========================================

const dataAPI = `https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com/customers/`;

function App() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [modal, setModal] = useState<ModalType | null>(null);
    const [apiKey, setApiKey] = useState(``);

    const tableHead = [
        { text: "ID", field: "id", formType: "number" },
        { text: "Name", field: "name", formType: "text" },
        { text: "Email", field: "email", formType: "email" },
        { text: "Phone", field: "phone", formType: "text" },
        { text: "Address", field: "address", formType: "text" },
        {
            text: "Edit",
            field: "edit",
            action: true,
            ownStyles: { color: "rgb(255, 200, 61)", fontWeight: "600" },
            onclickBtn: (user: User) => {
                setModal({ type: "edit", target: user });
            },
        },
        {
            text: "Delete",
            field: "delete",
            action: true,
            ownStyles: { color: "rgba(255, 61, 61, 0.9)", fontWeight: "600" },
            onclickBtn: (user: User) => {
                setModal({ type: "delete", target: user });
            },
        },
    ];

    useEffect(() => {
        (async () => {
            const tokenRespone = await fetch(
                "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com/auth/signin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: "sonnv@test.com",
                        password: "12345678",
                    }),
                },
            )
                .then((res) => res.json())
                .catch(() => console.log(`Get token Failed`));

            setApiKey(tokenRespone.accessToken);

            fetch(dataAPI, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${tokenRespone.accessToken}`,
                },
            })
                .then((res) => res.json())
                .then((res) => setUsers(res))
                .catch(() => console.log(`Get users Failed`));
        })();
    }, []);

    if (!users) return <div> Loading ... </div>;

    return (
        <>
            <MyTable
                users={users}
                tableHead={tableHead}
                onAdd={() => {
                    setModal({
                        type: "add",
                        target: {
                            id: 0,
                            name: ``,
                            email: ``,
                            phone: ``,
                            address: ``,
                        },
                    });
                }}
            ></MyTable>

            {modal?.type === "edit" ? (
                <MyDialog
                    disabledField={["id"]}
                    targetUser={modal.target}
                    tableHead={tableHead}
                    isOpen={true}
                    title="Editing user"
                    description="cant change the ID"
                    //
                    onSend={async (userUpdated) => {
                        const pass = await handleApi(
                            `PUT`,
                            userUpdated.id,
                            apiKey,
                            userUpdated,
                        );
                        if (pass) {
                            setUsers(
                                users.map((user) =>
                                    userUpdated.id === user.id
                                        ? userUpdated
                                        : user,
                                ),
                            );
                        }
                    }}
                    onClose={() => {
                        setModal(null);
                    }}
                />
            ) : null}

            {modal?.type === "delete" ? (
                <MyDialog
                    targetUser={{}}
                    tableHead={null}
                    isOpen={true}
                    title="Confirm delete this user ?"
                    submitText="Confirm"
                    //
                    onConfirm={async () => {
                        const id = modal.target.id;
                        const pass = await handleApi(
                            `DELETE`,
                            id,
                            apiKey,
                            null,
                        );
                        if (pass)
                            setUsers(users.filter((user) => user.id !== id));
                        setModal(null);
                    }}
                    onClose={() => {
                        setModal(null);
                    }}
                />
            ) : null}

            {modal?.type === "add" ? (
                <MyDialog
                    targetUser={{}}
                    tableHead={tableHead}
                    isOpen={true}
                    title="Add a new user "
                    //
                    onSend={async (newUser) => {
                        const pass = await handleApi(
                            `POST`,
                            null,
                            apiKey,
                            newUser,
                        );
                        if (pass) setUsers([...users, newUser]);
                    }}
                    onClose={() => {
                        setModal(null);
                    }}
                />
            ) : null}
        </>
    );
}

export default App;

// ================================= API =================================

async function handleApi(
    method: string,
    id: number | null,
    token: string,
    newItem: User | null,
) {
    try {
        const res = await fetch(`${dataAPI}${id ? id : ""}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(newItem && {
                    "Content-Type": "application/json",
                }),
            },
            ...(newItem && { body: JSON.stringify(newItem) }),
        });

        console.log(res);

        if (!res.ok) return false;
        return true;
    } catch (err) {
        console.log("Failed:", err);
        return false;
    }
}
