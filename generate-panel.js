import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = process.argv[2];

if (!input) {
    console.error('Errore: Fornire un input nel formato cartella.nome (es. contacts.test)');
    process.exit(1);
}

const parts = input.split('.');
if (parts.length < 2) {
    console.error('Errore: Formato non valido. Usa cartella.nome (es. contacts.test)');
    process.exit(1);
}

const folderName = parts[0];
const panelNameLower = parts[1];
const panelNameCapitalized = panelNameLower.charAt(0).toUpperCase() + panelNameLower.slice(1);

const panelsDir = path.join(__dirname, 'src', 'features', 'panels');
const targetDir = path.join(panelsDir, folderName, panelNameLower);

// 1. Creazione cartella
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 2. Creazione file componente
const componentPath = path.join(targetDir, `${panelNameCapitalized}Panel.tsx`);
const componentContent = `import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface I${panelNameCapitalized}StoreState extends IPanelUIState {
    _placeholder?: string;
}

const ${panelNameCapitalized}Panel = () => {
    const initialUiState: I${panelNameCapitalized}StoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, I${panelNameCapitalized}StoreState>
            kind={"${panelNameLower}"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for ${panelNameCapitalized}</div>
            <div>Form placeholder for ${panelNameCapitalized}</div>
        </GenericPanel>
    )
}

export default ${panelNameCapitalized}Panel;
`;

fs.writeFileSync(componentPath, componentContent);
console.log(`Creato componente: ${componentPath}`);

// 3. Modifica PanelRegistry.tsx
const registryPath = path.join(panelsDir, 'PanelRegistry.tsx');
let registryContent = fs.readFileSync(registryPath, 'utf8');

// Aggiungi import
const importStatement = `import ${panelNameCapitalized}Panel from "@features/panels/${folderName}/${panelNameLower}/${panelNameCapitalized}Panel.tsx";\n`;
if (!registryContent.includes(importStatement)) {
    const lastImportIndex = registryContent.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
        const nextLineAfterLastImport = registryContent.indexOf('\n', lastImportIndex) + 1;
        registryContent = registryContent.slice(0, nextLineAfterLastImport) + importStatement + registryContent.slice(nextLineAfterLastImport);
    } else {
        registryContent = importStatement + registryContent;
    }
}

// Aggiungi a TPanelKind prima di 'not-implemented'
if (!registryContent.includes(`| '${panelNameLower}'`)) {
    const notImplementedKindIndex = registryContent.indexOf("'not-implemented'");
    if (notImplementedKindIndex !== -1) {
        const lineStartIndex = registryContent.lastIndexOf('|', notImplementedKindIndex);
        if (lineStartIndex !== -1) {
            const kindToInsert = `| '${panelNameLower}'\n    `;
            registryContent = registryContent.slice(0, lineStartIndex) + kindToInsert + registryContent.slice(lineStartIndex);
        }
    }
}

// Aggiungi a PANEL_REGISTRY
if (!registryContent.includes(`${panelNameLower}: () =>`)) {
    const notImplementedRegistryIndex = registryContent.indexOf('"not-implemented": () =>');
    if (notImplementedRegistryIndex !== -1) {
        const lineStartIndex = registryContent.lastIndexOf('\n', notImplementedRegistryIndex) + 1;
        const registryEntry = `    ${panelNameLower}: () => <${panelNameCapitalized}Panel />,\n`;
        registryContent = registryContent.slice(0, lineStartIndex) + registryEntry + registryContent.slice(lineStartIndex);
    }
}

fs.writeFileSync(registryPath, registryContent);
console.log(`Aggiornato PanelRegistry.tsx`);

// 4. Modifica MenuEntries.ts
const menuEntriesPath = path.join(__dirname, 'src', 'shared', 'ui', 'layout', 'menu', 'MenuEntries.ts');
let menuContent = fs.readFileSync(menuEntriesPath, 'utf8');

// Definiamo la chiave i18n che stiamo cercando (es: menu.contacts.seaports)
const targetI18nKey = `menu.${folderName}.${panelNameLower}`;

// Regex per trovare l'oggetto che contiene la i18nKey specifica
// Questa regex cattura l'intero oggetto { ... i18nKey: "..." ... }
const entryRegex = new RegExp(`(\\{\\s*i18nKey:\\s*["']${targetI18nKey}["'][^}]*)(\\s*\\})`, 'g');

if (menuContent.includes(targetI18nKey)) {
    // Caso 1: La voce esiste già. Aggiungiamo il component se manca.
    menuContent = menuContent.replace(entryRegex, (match, content, closing) => {
        // Se il component è già presente, non fare nulla
        if (content.includes('component:')) {
            return match;
        }
        // Altrimenti aggiungi il component prima della chiusura della graffa
        return `${content}, component: "${panelNameLower}" ${closing}`;
    });

    fs.writeFileSync(menuEntriesPath, menuContent);
    console.log(`Aggiornato component in voce esistente in MenuEntries.ts`);
} else {
    // Caso 2: La voce non esiste, la aggiungiamo al subMenu del gruppo (vecchia logica corretta)
    const groupKey = `menu.${folderName}.self`;
    const groupIndex = menuContent.indexOf(groupKey);

    if (groupIndex !== -1) {
        const subMenuStartIndex = menuContent.indexOf('subMenu: [', groupIndex);
        if (subMenuStartIndex !== -1) {
            const closingBracketIndex = menuContent.indexOf(']', subMenuStartIndex);
            const lastEntryIndex = menuContent.lastIndexOf('}', closingBracketIndex);
            const insertionIndex = lastEntryIndex !== -1 ? lastEntryIndex + 1 : subMenuStartIndex + 10;

            const newMenuEntry = `,\n            { i18nKey: "${targetI18nKey}", component: "${panelNameLower}" }`;
            menuContent = menuContent.slice(0, insertionIndex) + newMenuEntry + menuContent.slice(insertionIndex);

            fs.writeFileSync(menuEntriesPath, menuContent);
            console.log(`Aggiunta nuova voce a MenuEntries.ts`);
        }
    } else {
        console.warn(`Attenzione: Gruppo menu "${groupKey}" non trovato.`);
    }
}

// 5. Modifica menu.json (it e en)
const locales = ['it', 'en'];
locales.forEach(lang => {
    const menuJsonPath = path.join(__dirname, 'public', 'locales', lang, 'menu.json');
    if (fs.existsSync(menuJsonPath)) {
        try {
            const raw = fs.readFileSync(menuJsonPath, 'utf8');
            let menuJsonContent = JSON.parse(raw);
            
            if (!menuJsonContent.menu) menuJsonContent.menu = {};
            if (typeof menuJsonContent.menu[folderName] !== 'object') {
                menuJsonContent.menu[folderName] = { self: folderName.charAt(0).toUpperCase() + folderName.slice(1) };
            }
            
            if (!menuJsonContent.menu[folderName][panelNameLower]) {
                menuJsonContent.menu[folderName][panelNameLower] = panelNameCapitalized;
                fs.writeFileSync(menuJsonPath, JSON.stringify(menuJsonContent, null, 2));
                console.log(`Aggiornato ${lang}/menu.json`);
            }
        } catch (e) {
            console.error(`Errore durante l'aggiornamento di ${menuJsonPath}:`, e);
        }
    }
});
