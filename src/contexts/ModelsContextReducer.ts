import { ModelsContextAttributes } from "./ModelsContext";

export interface ModelsReducerArgs {
  type: "SET_MODELS";
  payload: ModelsContextAttributes
}

export default function ModelsContextReducer(state: ModelsContextAttributes, { type, payload }: ModelsReducerArgs) {
  switch (type) {
    case "SET_MODELS":
      return { ...payload };
    default:
      return state;
  }
}