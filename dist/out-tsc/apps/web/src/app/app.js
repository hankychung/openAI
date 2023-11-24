import { __awaiter } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { get, set } from 'idb-keyval';
import styles from './app.module.scss';
import { Button, Form, Input, Tag } from 'antd';
import { api } from './service';
const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple'
];
export function App() {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [tagsCount, setTagsCount] = useState({});
    const [curTags, setCurTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const getLocalDish = useMemoizedFn(() => __awaiter(this, void 0, void 0, function* () {
        const local = ((yield get('dish')) || {});
        return local;
    }));
    const initTags = useMemoizedFn(() => __awaiter(this, void 0, void 0, function* () {
        const tags = [];
        const tagsCount = {};
        getLocalDish().then((dict) => {
            Object.values(dict).forEach((arr) => {
                arr.forEach((t) => {
                    if (tagsCount[t]) {
                        tagsCount[t] += 1;
                    }
                    else {
                        tagsCount[t] = 1;
                    }
                    tags.push(t);
                });
            });
            setTags([...new Set(tags)]);
            setTagsCount(tagsCount);
        });
    }));
    useEffect(() => {
        initTags();
    }, [initTags]);
    const getTags = () => __awaiter(this, void 0, void 0, function* () {
        const local = yield getLocalDish();
        if (local[title]) {
            return;
        }
        setLoading(true);
        api
            .createTags(title)
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            const info = JSON.parse(res.answer.replaceAll('\n', ''));
            delete info.dish;
            info.isVegetarian = info.isVegetarian ? '素菜' : '荤菜';
            local[title] = Object.values(info).filter(Boolean);
            setTags([...new Set([...tags, ...local[title]])]);
            setCurTags(local[title]);
            local[title].forEach((t) => {
                if (tagsCount[t]) {
                    tagsCount[t] += 1;
                }
                else {
                    tagsCount[t] = 1;
                }
            });
            setTagsCount(Object.assign({}, tagsCount));
            set('dish', local);
        }))
            .finally(() => {
            setLoading(false);
        });
    });
    return (_jsxs("div", { children: [_jsxs("div", Object.assign({ className: styles.lft }, { children: [_jsxs(Form.Item, Object.assign({ label: "\u83DC\u54C1" }, { children: [_jsx(Input, { value: title, onChange: (e) => {
                                    setCurTags([]);
                                    setTitle(e.target.value);
                                }, disabled: loading }), _jsx("div", { children: curTags.map((tag, index) => {
                                    return (_jsx(Tag, Object.assign({ color: colors[Math.min(index, colors.length - 1)] }, { children: `${tag} (${tagsCount[tag]})` }), tag));
                                }) }), _jsx(Button, Object.assign({ className: styles.btn, type: "primary", onClick: getTags, disabled: loading }, { children: "\u786E\u8BA4" }))] })), _jsx("div", { children: "\u6211\u7684\u6807\u7B7E" })] })), _jsxs("div", Object.assign({ className: styles.rgt }, { children: [_jsx("div", { children: "\u6807\u7B7E\u5E93" }), _jsx("div", { children: tags.map((tag, index) => {
                            return (_jsx(Tag, Object.assign({ color: colors[Math.min(index, colors.length - 1)] }, { children: `${tag} (${tagsCount[tag]})` }), tag));
                        }) })] }))] }));
}
export default App;
//# sourceMappingURL=app.js.map