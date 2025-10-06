import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

describe("tipsjar contract", () => {
  it("tips wallet_2 with 100 uSTX and a message", () => {
    const accounts = simnet.getAccounts();
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;

    // Send tip with message
    const tipCall = simnet.callPublicFn(
      "tipsjar", 
      "tip", 
      [
        Cl.principal(wallet2), 
        Cl.uint(100),
        Cl.stringUtf8("Thanks for the great content!")
      ], 
      wallet1
    );

    expect(tipCall.result).toBeOk(Cl.bool(true));

    // Check tip amount using get-tip
    const tipValue = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip",
      [Cl.principal(wallet1), Cl.principal(wallet2)],
      wallet1
    );

    expect(tipValue.result).toBeSome(Cl.uint(100));

    // Check full tip data with message
    const tipWithMessage = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip-with-message",
      [Cl.principal(wallet1), Cl.principal(wallet2)],
      wallet1
    );

    expect(tipWithMessage.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(100),
        message: Cl.stringUtf8("Thanks for the great content!")
      })
    );
  });

  it("handles empty message", () => {
    const accounts = simnet.getAccounts();
    const wallet1 = accounts.get("wallet_1")!;
    const wallet3 = accounts.get("wallet_3")!;

    // Send tip with empty message
    const tipCall = simnet.callPublicFn(
      "tipsjar", 
      "tip", 
      [
        Cl.principal(wallet3), 
        Cl.uint(50),
        Cl.stringUtf8("")
      ], 
      wallet1
    );

    expect(tipCall.result).toBeOk(Cl.bool(true));

    // Verify tip with empty message
    const tipWithMessage = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip-with-message",
      [Cl.principal(wallet1), Cl.principal(wallet3)],
      wallet1
    );

    expect(tipWithMessage.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(50),
        message: Cl.stringUtf8("")
      })
    );
  });

  it("returns none for non-existent tip", () => {
    const accounts = simnet.getAccounts();
    const deployer = accounts.get("deployer")!;
    const wallet2 = accounts.get("wallet_2")!;

    // Query tip that doesn't exist
    const tipValue = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip",
      [Cl.principal(deployer), Cl.principal(wallet2)],
      deployer
    );

    expect(tipValue.result).toBeNone();

    // Query with get-tip-with-message should also return none
    const tipWithMessage = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip-with-message",
      [Cl.principal(deployer), Cl.principal(wallet2)],
      deployer
    );

    expect(tipWithMessage.result).toBeNone();
  });

  it("overwrites previous tip with new message", () => {
    const accounts = simnet.getAccounts();
    const wallet2 = accounts.get("wallet_2")!;
    const wallet3 = accounts.get("wallet_3")!;

    // First tip
    const firstTip = simnet.callPublicFn(
      "tipsjar", 
      "tip", 
      [
        Cl.principal(wallet3), 
        Cl.uint(100),
        Cl.stringUtf8("First message")
      ], 
      wallet2
    );

    expect(firstTip.result).toBeOk(Cl.bool(true));

    // Second tip overwrites first
    const secondTip = simnet.callPublicFn(
      "tipsjar", 
      "tip", 
      [
        Cl.principal(wallet3), 
        Cl.uint(200),
        Cl.stringUtf8("Second message")
      ], 
      wallet2
    );

    expect(secondTip.result).toBeOk(Cl.bool(true));

    // Verify latest tip
    const tipWithMessage = simnet.callReadOnlyFn(
      "tipsjar",
      "get-tip-with-message",
      [Cl.principal(wallet2), Cl.principal(wallet3)],
      wallet2
    );

    expect(tipWithMessage.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(200),
        message: Cl.stringUtf8("Second message")
      })
    );
  });
});
