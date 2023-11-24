import { jsx as _jsx } from "react/jsx-runtime";
import styles from './ui.module.scss';
export function Ui(props) {
    return (_jsx("div", Object.assign({ className: styles['container'] }, { children: _jsx("h1", { children: "Welcome to Ui!" }) })));
}
export default Ui;
//# sourceMappingURL=ui.js.map