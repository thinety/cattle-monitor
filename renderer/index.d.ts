declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare const CattleMonitor: {
  getCattleData: CattleMonitor.GetCattleData,
  setCattleData: CattleMonitor.SetCattleData,
};

declare namespace CattleMonitor {
  type CattleData = {};
  type GetCattleData = () => Promise<CattleData>;
  type SetCattleData = (data: CattleData) => Promise<void>;
}
