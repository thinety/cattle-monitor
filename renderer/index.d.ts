module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

const CattleMonitor: {
  getCattleData: CattleMonitor.GetCattleData,
  setCattleData: CattleMonitor.SetCattleData,
};

namespace CattleMonitor {
  type CattleData = {};
  type GetCattleData = () => Promise<CattleData>;
  type SetCattleData = (data: CattleData) => Promise<void>;
}
