export function getCodeDesc(masterData: any, codeID:number): string | null {
    if (masterData && masterData.model && masterData.model.content) {
        const item = masterData.model.content.find((content: { codeId: number; codeDesc: string }) => content.codeId == codeID);
        return item ? item.codeDesc : null;
    }
    return null;
}