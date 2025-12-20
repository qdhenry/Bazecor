import React from "react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { KeyLabelsProvider, useKeyLabels } from "./KeyLabelsContext";

// Mock electron ipcRenderer
vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: vi.fn(),
  },
}));

describe("KeyLabelsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeyLabelsProvider deviceId="test-device">{children}</KeyLabelsProvider>
  );

  test("getLabel returns undefined for unlabeled key", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    // Wait for loading to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(0, 0)).toBeUndefined();
  });

  test("setLabel adds a new label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setLabel(5, 0, "Test Label", false);
    });

    expect(result.current.getLabel(5, 0)).toBe("Test Label");
  });

  test("getLabel returns global label as fallback", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: -1, label: "Global Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should return global label for any layer
    expect(result.current.getLabel(5, 0)).toBe("Global Label");
    expect(result.current.getLabel(5, 3)).toBe("Global Label");
  });

  test("layer-specific label takes precedence over global", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [
        { keyPosition: 5, layer: -1, label: "Global Label" },
        { keyPosition: 5, layer: 0, label: "Layer 0 Label" },
      ],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Layer 0 Label");
    expect(result.current.getLabel(5, 1)).toBe("Global Label");
  });

  test("removeLabel removes the label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: 0, label: "Test Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Test Label");

    act(() => {
      result.current.removeLabel(5, 0);
    });

    expect(result.current.getLabel(5, 0)).toBeUndefined();
  });

  test("displaySettings has correct default values", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.displaySettings).toEqual({
      showLabelsOnKeys: false,
      maxCharacters: 20,
      fontSize: 8,
      displayMode: "multiline",
      labelColor: "#a855f7",
      backgroundLabelColor: "#000000",
      backgroundLabelOpacity: 0.4,
    });
  });

  test("setDisplaySettings updates state correctly", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setDisplaySettings({ showLabelsOnKeys: true });
    });

    expect(result.current.displaySettings.showLabelsOnKeys).toBe(true);
    // Other settings should remain unchanged
    expect(result.current.displaySettings.maxCharacters).toBe(20);
    expect(result.current.displaySettings.fontSize).toBe(8);
    expect(result.current.displaySettings.displayMode).toBe("multiline");
    expect(result.current.displaySettings.labelColor).toBe("#a855f7");
  });

  test("setDisplaySettings updates labelColor correctly", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setDisplaySettings({ labelColor: "#ff0000" });
    });

    expect(result.current.displaySettings.labelColor).toBe("#ff0000");
    // Other settings should remain unchanged
    expect(result.current.displaySettings.showLabelsOnKeys).toBe(false);
  });

  test("displaySettings loads from stored data", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [],
      displaySettings: {
        showLabelsOnKeys: true,
        maxCharacters: 15,
        fontSize: 10,
        displayMode: "truncate",
        labelColor: "#00ff00",
        backgroundLabelColor: "#ffffff",
        backgroundLabelOpacity: 0.6,
      },
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.displaySettings).toEqual({
      showLabelsOnKeys: true,
      maxCharacters: 15,
      fontSize: 10,
      displayMode: "truncate",
      labelColor: "#00ff00",
      backgroundLabelColor: "#ffffff",
      backgroundLabelOpacity: 0.6,
    });
  });

  test("setDisplaySettings updates backgroundLabelColor and backgroundLabelOpacity correctly", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setDisplaySettings({ backgroundLabelColor: "#ff00ff", backgroundLabelOpacity: 0.8 });
    });

    expect(result.current.displaySettings.backgroundLabelColor).toBe("#ff00ff");
    expect(result.current.displaySettings.backgroundLabelOpacity).toBe(0.8);
    // Other settings should remain unchanged
    expect(result.current.displaySettings.labelColor).toBe("#a855f7");
  });

  test("exportLabels includes displaySettings", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setDisplaySettings({ showLabelsOnKeys: true });
    });

    const exported = result.current.exportLabels();

    expect(exported.displaySettings).toBeDefined();
    expect(exported.displaySettings?.showLabelsOnKeys).toBe(true);
  });

  test("importLabels applies displaySettings from imported data", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    const importedDisplaySettings = {
      showLabelsOnKeys: true,
      maxCharacters: 12,
      fontSize: 11,
      displayMode: "truncate",
      labelColor: "#123456",
      backgroundLabelColor: "#654321",
      backgroundLabelOpacity: 0.9,
    };

    act(() => {
      result.current.importLabels(
        {
          version: 1,
          deviceId: "test-device",
          labels: [],
          displaySettings: importedDisplaySettings,
        },
        "replace",
      );
    });

    await vi.waitFor(() => expect(result.current.displaySettings).toEqual(importedDisplaySettings));
  });
});
