"use client";

import AuthGateDialog from "@/components/auth/AuthGateDialog";
import JsonToolsAiPanel from "@/components/json-tools/JsonToolsAiPanel";
import JsonToolsEditorWorkspace from "@/components/json-tools/JsonToolsEditorWorkspace";
import JsonToolsSidebar from "@/components/json-tools/JsonToolsSidebar";
import JsonToolsStatusBanners from "@/components/json-tools/JsonToolsStatusBanners";
import JsonToolsTopBar from "@/components/json-tools/JsonToolsTopBar";
import SEO from "@/components/seo/SEO";
import { useJsonTools } from "@/hooks/useJsonTools";

export default function JsonTools() {
  const {
    activeTool,
    aiInput,
    aiLoading,
    aiMessages,
    aiPanelOpen,
    aiQuickAction,
    aiRepair,
    aiRepairLoading,
    aiScrollRef,
    aiSendMessage,
    authGateFeature,
    authGateOpen,
    compareResult,
    copyCurrent,
    currentList,
    error,
    input,
    isAuthed,
    isCompare,
    isConverter,
    isValidate,
    output,
    rightInput,
    run,
    runLabel,
    saveSnippet,
    setAiInput,
    setAiPanelOpen,
    setAuthGateOpen,
    setInput,
    setRightInput,
    setSidebarOpen,
    setSidebarTab,
    showRunButton,
    sidebarOpen,
    sidebarTab,
    switchTool,
    toggleAiPanel,
    user,
    validation,
    clearAll,
    deleteSnippet,
    downloadCurrent,
    handleLogout,
    loadSnippet,
    openAuthGateForFeature,
  } = useJsonTools();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SEO
        title="JSON Tools — Online JSON Formatter, Validator & Converter"
        description="Free online JSON toolkit. Format, validate, minify, compare JSON, and convert to TypeScript, SQL, CSV, and JSON Schema. AI-powered JSON repair included."
      />

      {sidebarOpen && (
        <JsonToolsSidebar
          currentList={currentList}
          isAuthed={isAuthed}
          onClose={() => setSidebarOpen(false)}
          onDeleteSnippet={deleteSnippet}
          onLoadSnippet={loadSnippet}
          onLogout={handleLogout}
          onRequestSignIn={() => openAuthGateForFeature("ai")}
          onSaveSnippet={saveSnippet}
          onTabChange={setSidebarTab}
          sidebarTab={sidebarTab}
          user={user}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <JsonToolsTopBar
          activeTool={activeTool}
          aiPanelOpen={aiPanelOpen}
          onClearAll={clearAll}
          onCopyCurrent={copyCurrent}
          onDownloadCurrent={downloadCurrent}
          onRun={run}
          onSwitchTool={switchTool}
          onToggleAiPanel={toggleAiPanel}
          onToggleSidebar={() => setSidebarOpen(true)}
          runLabel={runLabel}
          showRunButton={showRunButton}
          sidebarOpen={sidebarOpen}
        />

        <JsonToolsStatusBanners
          aiRepairLoading={aiRepairLoading}
          compareResult={compareResult}
          error={error}
          input={input}
          isCompare={isCompare}
          isValidate={isValidate}
          onAiRepair={() => void aiRepair()}
          rightInput={rightInput}
          validation={validation}
        />

        <JsonToolsEditorWorkspace
          activeTool={activeTool}
          input={input}
          isCompare={isCompare}
          isConverter={isConverter}
          onCopyOutput={copyCurrent}
          onInputChange={setInput}
          onRightInputChange={setRightInput}
          output={output}
          rightInput={rightInput}
        />
      </div>

      {aiPanelOpen && (
        <JsonToolsAiPanel
          aiInput={aiInput}
          aiLoading={aiLoading}
          aiMessages={aiMessages}
          aiRepairLoading={aiRepairLoading}
          aiScrollRef={aiScrollRef}
          onClose={() => setAiPanelOpen(false)}
          onInputChange={setAiInput}
          onQuickAction={aiQuickAction}
          onRepair={aiRepair}
          onSendMessage={aiSendMessage}
        />
      )}

      <AuthGateDialog
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        feature={authGateFeature}
        onSuccess={() => {
          if (authGateFeature === "ai") {
            setAiPanelOpen(true);
          }
        }}
      />
    </div>
  );
}
