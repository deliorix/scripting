// region menu
var path = ["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax"];
var keys_path = ["Config", "Scripts", "JS Keybinds"];

UI.AddSubTab(["Config", "SUBTAB_MGR"], "paralax");
UI.AddCheckbox(path, "Enabled");

UI.AddCheckbox(path, "Safepoint on limbs"), 
UI.AddCheckbox(path, "Instant doubletap"), 
UI.AddCheckbox(path, "Instant recharge"), 
UI.AddHotkey(keys_path, "Minimum damage override", "Minimum damage override"), 
UI.AddSliderInt(path, "Minimum damage override", 0, 130);
UI.AddCheckbox(path, "Override in air hitchance"), 
UI.AddSliderInt(path, "In air hitchance", 0, 100), 
UI.AddCheckbox(path, "Override no scope hitchance"), 
UI.AddSliderInt(path, "No scope hitchance", 0, 100);
// endregion

// region main
function SafepointOnLimbs() {
    if (!UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Safepoint on limbs"])) return;
    Ragebot.ForceHitboxSafety(12), Ragebot.ForceHitboxSafety(11), Ragebot.ForceHitboxSafety(10), Ragebot.ForceHitboxSafety(9);
}

function OverrideMinimumDamage() {
    if (!UI.GetValue(["Config", "Scripts", "JS Keybinds", "Minimum damage override"])) return;
    var target = Entity.GetEnemies();
    value = UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Minimum damage override"]);
    for (i = 0; i < target.length; i++) {
        Ragebot.ForceTargetMinimumDamage(target[i], value);
    }
}

function SetHitchanceInAir() {
    if (!UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Override in air hitchance"])) return;
    var localPlayerWeapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
    if (localPlayerWeapon != "ssg 08" && localPlayerWeapon != "r8 revolver") return;
    var m_fFlags = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_fFlags");
    !(m_fFlags & 1 << 0) && !(m_fFlags & 1 << 18) && (target = Ragebot.GetTarget(), value = UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "In air hitchance"]), Ragebot.ForceTargetHitchance(target, value));
}

function NoScopeHitchance() {
    if (!UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Override no scope hitchance"])) return;
    var weaponName = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
    if (weaponName != "scar 20" && weaponName != "g3sg1" && weaponName != "ssg 08" && weaponName != "awp") return;
    var isScoped = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_bIsScoped");
    if (!isScoped) Ragebot.ForceTargetHitchance(Ragebot.GetTarget(), UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "No scope hitchance"]));
}

function FrameNetUpdateStart() {
    UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Instant doubletap"]) && (Exploit.OverrideTolerance(0), Exploit.OverrideShift(14), shouldDisable = true), !UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Instant doubletap"]) && shouldDisable == true && (Exploit.OverrideTolerance(1), Exploit.OverrideShift(12), shouldDisable = false);
}

var rechargeTime = 0, updateTime = true, shouldDisableRecharge = true;
function InstantRecharge() {
    if (UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Instant recharge"])) {
        const Time = new Date().getTime() / 1000;
        Exploit.DisableRecharge(), shouldDisableRecharge = true;
        if (Exploit.GetCharge() >= 1) {
            updateTime = true;
        }
        Exploit.GetCharge() < 1 && (updateTime && (rechargeTime = Time, updateTime = false), Time - rechargeTime > 0.5 && updateTime == false && (Exploit.Recharge(), rechargeTime = Time))
    } else {
        shouldDisableRecharge && (Exploit.EnableRecharge(), shouldDisableRecharge = false);
    }
}
// endregion

// region createmove
function CreateMove() {
    if (!UI.GetValue(["Config", "SUBTAB_MGR", "paralax", "SHEET_MGR", "paralax", "Enabled"])) return;
    if (!Entity.IsValid(Entity.GetLocalPlayer())) return;
    if (!Entity.IsAlive(Entity.GetLocalPlayer())) return;
    SafepointOnLimbs(), OverrideMinimumDamage(), SetHitchanceInAir(), NoScopeHitchance(), InstantRecharge();
}
// endregion

// region callbacks
function Main() {
    Cheat.RegisterCallback("CreateMove", "CreateMove"), 
    Cheat.RegisterCallback("FRAME_NET_UPDATE_START", "FrameNetUpdateStart");
}

Main();
// endregion
