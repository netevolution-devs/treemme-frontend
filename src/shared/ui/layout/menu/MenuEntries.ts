export interface IMenuEntry {
    i18nKey: string;
    subMenu?: IMenuEntry[];
}

export const MenuEntries: IMenuEntry[] = [
    {
        i18nKey: "menu.contatti.self",
        subMenu: [
            { i18nKey: "menu.contatti.cap" },
            { i18nKey: "menu.contatti.nazioni" },
            { i18nKey: "menu.contatti.province" },
            { i18nKey: "menu.contatti.contatti" },
            { i18nKey: "menu.contatti.porti-marittimi" }
        ]
    },
    {
        i18nKey: "menu.pellami.self",
        subMenu: [
            { i18nKey: "menu.pellami.pesi" },
            { i18nKey: "menu.pellami.speci" },
            { i18nKey: "menu.pellami.taglie" },
            { i18nKey: "menu.pellami.pellami" },
            { i18nKey: "menu.pellami.spessori" },
            { i18nKey: "menu.pellami.tipologie" },
            { i18nKey: "menu.pellami.scuortature" },
            { i18nKey: "menu.pellami.provenienze" },
            { i18nKey: "menu.pellami.stati-lavorazione" }
        ]
    },
    {
        i18nKey: "menu.prodotti.self",
        subMenu: [
            { i18nKey: "menu.prodotti.scelte" },
            { i18nKey: "menu.prodotti.articoli" },
            { i18nKey: "menu.prodotti.ricerca" },
            { i18nKey: "menu.prodotti.prodotti" },
            { i18nKey: "menu.prodotti.categorie" },
            { i18nKey: "menu.prodotti.articoli-tipo" }
        ]
    },
    {
        i18nKey: "menu.ordini.self",
        subMenu: [
            { i18nKey: "menu.ordini.ordini-clienti" },
            { i18nKey: "menu.ordini.ordini-fornitori" },
            { i18nKey: "menu.ordini.ricerca-ordini-clienti" },
            { i18nKey: "menu.ordini.scadenziario-fornitori" },
            { i18nKey: "menu.ordini.ricerca-ordini-fornitori" }
        ]
    },
    {
        i18nKey: "menu.magazzino.self",
        subMenu: [
            { i18nKey: "menu.magazzino.movimenti" },
            { i18nKey: "menu.magazzino.tipo-pallets" },
            { i18nKey: "menu.magazzino.lotte-partite" },
            { i18nKey: "menu.magazzino.ricerca-lotti-partite" },
            { i18nKey: "menu.magazzino.lotti-conto-lavorazione" }
        ]
    },
    {
        i18nKey: "menu.produzione.self",
        subMenu: [
            { i18nKey: "menu.produzione.lotti" },
            { i18nKey: "menu.produzione.ricette" },
            { i18nKey: "menu.produzione.macchinari" },
            { i18nKey: "menu.produzione.produzione" },
            { i18nKey: "menu.produzione.lavorazioni" },
            { i18nKey: "menu.produzione.disinte-base" },
            { i18nKey: "menu.produzione.scelta-partite" },
            { i18nKey: "menu.produzione.monitor-pirovano" },
            { i18nKey: "menu.produzione.ricettario-pirovano" }
        ]
    },
    {
        i18nKey: "menu.ddt-fatture.self",
        subMenu: [
            { i18nKey: "menu.ddt-fatture.ddt" },
            { i18nKey: "menu.ddt-fatture.fatture" },
            { i18nKey: "menu.ddt-fatture.ricerca" }
        ]
    },
    {
        i18nKey: "menu.commerciale.self",
        subMenu: [
            { i18nKey: "menu.commerciale.clienti" },
            { i18nKey: "menu.commerciale.fornitori" },
            { i18nKey: "menu.commerciale.dati-partite" },
            { i18nKey: "menu.commerciale.costo-prodotti" },
            { i18nKey: "menu.commerciale.listino-prodotti" },
            { i18nKey: "menu.commerciale.rapportini-lavoro" },
            { i18nKey: "menu.commerciale.divise-monetarie-cambi" }
        ]
    },
    {
        i18nKey: "menu.analisi.self",
        subMenu: [
            { i18nKey: "menu.analisi.ordini" },
            { i18nKey: "menu.analisi.vendite" },
            { i18nKey: "menu.analisi.costi-ricavi" },
            { i18nKey: "menu.analisi.partite-lotti" },
            { i18nKey: "menu.analisi.conto-lavorazione" },
            { i18nKey: "menu.analisi.traffico-telefonico" },
            {
                i18nKey: "menu.analisi.controllo-qualita-iso.self",
                subMenu: [
                    { i18nKey: "menu.analisi.controllo-qualita-iso.evasione-ordini" },
                ]
            },
        ]
    },
    {
        i18nKey: "menu.sistema.self",
        subMenu: [
            { i18nKey: "menu.sistema.info" },
            { i18nKey: "menu.sistema.tool" },
            { i18nKey: "menu.sistema.console" },
            { i18nKey: "menu.sistema.accesso" },
            { i18nKey: "menu.sistema.fine-lavoro" },
        ]
    }
];
