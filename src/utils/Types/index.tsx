// interface Style {
//     [key: string]: string;
// }
// interface Column {
//     id?: number;
//     value: string;
//     text: string;
//     style?: Style;
// }
// interface Row {
//     id: number;
//     [key: string]: string | number;
// }

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;

    [key: string]: string | number;
}

interface TableHeadTypes {
    text: string;
    field: string;
    formType?: string;
    action?: boolean;
    ownStyles?: object;
    onclickBtn?: (user: User) => void;
    formDisabled?: boolean;
}

export type { User, TableHeadTypes };
