UI.AddSubTab(["Visuals", "SUBTAB_MGR"], "Other"),

UI.AddCheckbox(["Visuals", "SUBTAB_MGR", "Other", "SHEET_MGR", "Other"], "Indicators");
UI.AddColorPicker(["Visuals", "SUBTAB_MGR", "Other", "SHEET_MGR", "Other"], "Selected arrow color");

function RenderArc(x, y, radius, radius_inner, start_angle, end_angle, segments, color) {
    segments = 360 / segments;

    for (var i = start_angle; i < start_angle + end_angle; i = i + segments)
    {
        var rad = i * Math.PI / 180;
        var rad2 = (i + segments) * Math.PI / 180;

        var rad_cos = Math.cos(rad);
        var rad_sin = Math.sin(rad);

        var rad2_cos = Math.cos(rad2);
        var rad2_sin = Math.sin(rad2);

        var x1_inner = x + rad_cos * radius_inner;
        var y1_inner = y + rad_sin * radius_inner;

        var x1_outer = x + rad_cos * radius;
        var y1_outer = y + rad_sin * radius;

        var x2_inner = x + rad2_cos * radius_inner;
        var y2_inner = y + rad2_sin * radius_inner;

        var x2_outer = x + rad2_cos * radius;
        var y2_outer = y + rad2_sin * radius;

        Render.Polygon( [
            [ x1_outer, y1_outer ],
            [ x2_outer, y2_outer ],
            [ x1_inner, y1_inner ] ],
            color
        );

        Render.Polygon( [
            [ x1_inner, y1_inner ],
            [ x2_outer, y2_outer ],
            [ x2_inner, y2_inner ] ],
            color
        );
    }
}

var LeftActive = 0, BackActive = 1, RightActive = 0;

function manualAntiAim() {
    IsLeftPressed = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Left direction"]);
    IsBackPressed = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Back direction"]);
    IsRightPressed = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Right direction"]);

    if (IsLeftPressed) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], -90);
        LeftActive = 1, BackActive = 0, RightActive = 0;
    } else if (IsBackPressed) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
        LeftActive = 0, BackActive = 1, RightActive = 0;
    } else if (IsRightPressed) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 90)
        LeftActive = 0, BackActive = 0, RightActive = 1;
    }
}

var screensize = Render.GetScreenSize();
var x = screensize[0] / 2;
var y = screensize[1] / 2;

LPx = [x - 37, y + 9];
LPy = [x - 37, y - 9];
LPz = [x - 53, y];

RPx = [x + 37, y + 9];
RPy = [x + 37, y - 9];
RPz = [x + 53, y];

BPx = [x + 9, y + 37];
BPy = [x - 9, y + 37];
BPz = [x, y + 53];

function drawIndicators() {
    var font = Render.GetFont("segoeuib.ttf", 9, true);

    isDoubletap = UI.GetValue(["Rage", "Exploits", "Keys", "Double tap"]),
    isHideshots = UI.GetValue(["Rage", "Exploits", "Keys", "Hide shots"]),
    isForceBAIM = UI.GetValue(["Rage", "General", "General", "Key assignment", "Force body aim"]),
    isLBYmode = UI.GetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"]),
    isInverted = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]),
    isFakeduck = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"]);

    selectedcolor = UI.GetColor(["Visuals", "SUBTAB_MGR", "Other", "SHEET_MGR", "Other", "Selected arrow color"]);
    const red = selectedcolor[0], green = selectedcolor[1], blue = selectedcolor[2];

    duckAmount = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount");
    const alpha = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / .75)) % (Math.PI * 2))) * 255;
    const fd_alpha = Math.sin(Math.abs(-Math.PI + (duckAmount * (1 / .75)) % (Math.PI * 2))) * 255;

    var x_add = 0, MaxAngle = 0;

    const dtcolor = isDoubletap ? [255 - 255 * Exploit.GetCharge(), 255 * Exploit.GetCharge(), 0, 255] : [255, 0, 0, 255];

    if (Entity.IsAlive(Entity.GetLocalPlayer())) {
        if (!UI.GetValue(["Visuals", "SUBTAB_MGR", "Other", "SHEET_MGR", "Other", "Indicators"])) return;
        
        Render.Polygon([LPx, LPz, LPy], LeftActive ? [red, green, blue, alpha] : [0, 0, 0, 220]);
        Render.Polygon([BPy, BPx, BPz], BackActive ? [red, green, blue, alpha] : [0, 0, 0, 220]);
        Render.Polygon([RPy, RPz, RPx], RightActive ? [red, green, blue, alpha] : [0, 0, 0, 220]);

        if (!isForceBAIM) {
            switch (isLBYmode) {
                case 0: Render.String(x, y + 71, 1, "NORM", [0, 0, 0, 255], font); break;
                case 1: Render.String(x, y + 71, 1, "OPPOSITE", [0, 0, 0, 255], font); break;
                case 2: Render.String(x, y + 71, 1, "SWAY", [0, 0, 0, 255], font); break;
            }
        } else {
            Render.String(x, y + 71, 1, "BODY", [0, 0, 0, 255], font);
        }

        if (!isForceBAIM) {
            switch (isLBYmode) {
                case 0: Render.String(x, y + 70, 1, "NORM", [65, 160, 255, 255], font); break;
                case 1: Render.String(x, y + 70, 1, "OPPOSITE", [65, 160, 255, 255], font); break;
                case 2: Render.String(x, y + 70, 1, "SWAY", [65, 160, 255, 255], font); break;
            }
        } else {
            Render.String(x, y + 70, 1, "BODY", [130, 190, 45, 255], font);
        }

        if (isDoubletap && Exploit.GetCharge() == 1) {
            x_add = 0;
        } else if (isDoubletap && Exploit.GetCharge() < 1) {
            x_add = x_add - 6;
            MaxAngle = Exploit.GetCharge() * 360;
            RenderArc(x + 6, y + 86.5, 4.2, 2, -90, 360, 360, [0, 0, 0, 255]);
            RenderArc(x + 6, y + 86.5, 4.2, 2, -90, MaxAngle, 360, dtcolor);
        } else {
            x_add = 0;
        }

        Render.String(x + x_add, y + 81, 1, "DT", [0, 0, 0, 255], font);
        Render.String(x + x_add, y + 80, 1, "DT" , dtcolor, font);

        Render.String(x, y + 91, 1, isInverted ? "LEFT" : "RIGHT", [0, 0, 0, 255], font);
        Render.String(x, y + 90, 1, isInverted ? "LEFT" : "RIGHT", [255, 255, 255, 255], font);

        Render.String(x, y + 101, 1, isHideshots || Exploit.GetCharge() == 1 ? "HIDE" : "ANIM", isHideshots || Exploit.GetCharge() == 1 ? [0, 0, 0, 255] : [0, 0, 0, alpha], font);
        Render.String(x, y + 100, 1, isHideshots || Exploit.GetCharge() == 1 ? "HIDE" : "ANIM", isHideshots || Exploit.GetCharge() == 1 ? [50, 110, 170, 255] : [255, 145, 65, alpha], font);

        Render.String(x, y + 111, 1, isFakeduck ? "DUCK" : "", [0, 0, 0, fd_alpha], font);
        Render.String(x, y + 110, 1, isFakeduck ? "DUCK" : "", [255, 255, 255, fd_alpha], font);
    }
}

Cheat.RegisterCallback("CreateMove", "manualAntiAim");
Cheat.RegisterCallback("Draw", "drawIndicators");
