/**
 * babele.js - Babele Translation Registration for D&D 4e Compendium (Chinese)
 *
 * Registers compendium translation files with the Babele module.
 * Translation files are stored in the compendium/ directory, named
 * after the source compendium pack identifier:
 *   dnd-4e-compendium.module-powers.json
 *   dnd-4e-compendium.module-equipment.json
 *   etc.
 *
 * Each translation file contains:
 *   - label: Display name of the pack (in Chinese)
 *   - mapping: Custom field mappings (extends Babele's default Item/Actor mappings)
 *   - entries: Translation entries keyed by English name
 *
 * Default Item mappings provided by Babele:
 *   "name"        → name
 *   "description" → system.description.value
 *
 * Custom mappings (defined per-file) add:
 *   "source"       → system.powersourceName
 *   "chatFlavor"   → system.description.chat
 *   "requirements" → system.requirements
 *   "requirement"  → system.requirement
 *   "trigger"      → system.trigger
 *   "target"       → system.target
 *   "effectDetail" → system.effect.detail
 */

const MODULE_ID = "4e-trans";

/** Language codes that should trigger Chinese compendium translations */
const LANGUAGE_CODES = [
    "cn",
    "zh-CN",
    "zh_Hans",
    "zh-Hans",
    "zh-cn",
    "zh_hans",
    "zh",
];

/**
 * Register compendium translation directory with Babele.
 * Babele automatically discovers translation JSON files matching
 * installed compendium packs by filename convention.
 */
Hooks.once("babele.init", (babele) => {
    if (!babele?.register) {
        console.warn(`${MODULE_ID} | Babele API not available. Translation module will not function.`);
        return;
    }

    console.log(`${MODULE_ID} | Initializing Chinese compendium translations for D&D 4e.`);

    // Register translations for all Chinese language variants
    // Babele will scan our compendium/ directory for matching pack files
    for (const lang of LANGUAGE_CODES) {
        babele.register({
            module: MODULE_ID,
            lang: lang,
            dir: "compendium",
        });
        console.log(`${MODULE_ID} | Registered compendium dir for language: ${lang}`);
    }

    console.log(`${MODULE_ID} | Initialization complete.`);
});

// Log module load and register settings
Hooks.once("init", () => {
    console.log(`${MODULE_ID} | D&D 4e Compendium Chinese Translation Module v1.0.0 loaded.`);

    // Register module settings
    game.settings?.register?.(MODULE_ID, "welcomeDismissed", {
        name: "不再显示欢迎窗口",
        scope: "client",
        config: false,
        type: Boolean,
        default: false,
    });
});

Hooks.once("ready", () => {
    // Only show welcome dialog once per world
    const dismissed = game.settings?.get?.(MODULE_ID, "welcomeDismissed") ?? false;
    if (dismissed) return;

    const content = `
<div style="text-align:center; padding:10px;">
    <h2 style="margin:0 0 8px;">🎲 D&D 4e 合集包中文翻译</h2>
    <p style="font-size:14px; color:#666; margin:4px 0;">
        基于 Babele · 翻译数据来源于 4e TiddlyWiki
    </p>
    <hr style="margin:12px 0;">
    <p style="margin:8px 0;"><strong>制作者：</strong>Leochep</p>
    <p style="margin:8px 0;"><strong>译者：</strong>风守、鱼 等 4e 中文社区贡献者</p>
    <p style="margin:8px 0;">
        <strong>Wiki：</strong>
        <a href="https://4e-wiki.netlify.app/" target="_blank">
            https://4e-wiki.netlify.app/
        </a>
    </p>
    <hr style="margin:12px 0;">
    <p style="font-size:12px; color:#999; margin:4px 0;">
        共收录威能、专长、物品、职业、种族等翻译条目
    </p>
</div>`;

    const dialog = new foundry.applications.api.DialogV2({
        window: { title: "4e-trans · 中文翻译" },
        content: content,
        buttons: [
            {
                action: "dismiss",
                label: "不再显示",
                callback: () => {
                    game.settings?.set?.(MODULE_ID, "welcomeDismissed", true);
                }
            },
            {
                action: "close",
                label: "关闭",
                default: true
            }
        ],
        rejectClose: false,
    });

    dialog.render(true);
});
