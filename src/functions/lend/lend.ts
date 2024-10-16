import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Lend {
  token: TokenInput;
  quantity: BigInt;
}

export interface LendRes {
  Target: string;
  Tags: {
    Action: "Mint-Confirmation" | "Mint-Error";
    "Mint-Quantity"?: string;
    "Supplied-Quantity"?: string;
    "Refund-Quantity"?: string;
    Error?: string;
  };
  Data?: string;
}

export async function lend(
  aoUtils: AoUtils,
  { token, quantity }: Lend,
): Promise<LendRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const res: SendMessageRes = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: quantity.toString(),
      Recipient: oTokenAddress,
      "X-Action": "Mint",
    });

    return res.Output;
  } catch (error) {
    throw new Error("Error in lend function:" + error);
  }
}
