import {create} from "zustand";

// 创建一个store，用来保存状态和更新状态的逻辑
const useStore = create((set) => ({
    // num: 0,
    // setCount: (num: number) => set({count: num}),
    // inc: () => set((state: { count: number; }) => ({count: state.count + 1})),

    userName: "koobe",//默认的用户名
    setUserName: (name: string) => set({userName: name}),
}));

export default useStore