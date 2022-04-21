/*
	FILE: weaponsim.js
	AUTHOR: Alex Goodman
	EDIT DATE: 11/16/2018
	PURPOSE: Calculations for DPS simulations.
*/
var actitveGun;
var activeModSet;
var defaultModBox = "<div id='slot0' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot1' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot2' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot3' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div class='clear'></div><div id='slot4' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot5' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot6' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div><div id='slot7' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'></div>";
var damageTableDescriptor = ["Impact", "Puncture", "Slash", "Cold", "Electricity", "Heat", "Toxin", "Blast", "Corrosive", "Gas", "Magnetic", "Radiation", "Viral"];
var clearHTML = "<div class='clear'></div>";
var ttkElement;
var allStats = [];
var activeFireMode;
var lastArmor = -1;
var lastResist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var baseDamageNoMod = [0, 0, 0];
var shotgunStatusPellet = [0, 0, 0];
var rivenModData = new Object;
var rivenIDSpace = 1024;
var effectTranslatorMap = {
	MultishotMod: "Multishot",
	DamageMod: "Damage",
	ImpactMod: "Impact",
	PunctureMod: "Puncture",
	SlashMod: "Slash",
	CritChanceMod: "Critical Chance",
	CritMultiplierMod: "Critical Damage",
	ColdMod: "Cold",
	ElectricityMod: "Electricity",
	HeatMod: "Heat",
	ToxinMod: "Toxin",
	StatusChanceMod: "Status Chance",
	StatusDurationMod: "Status Duration",
	CorpusFactionMod: "Damage to Corpus",
	GrineerFactionMod: "Damage to Grineer",
	InfestedFactionMod: "Damage to Infested",
	FireRateMod: "Fire Rate",
	MagazineMod: "Magazine Capacity",
	AmmoMaxMod: "Ammo Maximum",
	FlightSpeedMod: "Flight Speed",
	ReloadTimeMod: "Reload Speed",
	RecoilMod: "Weapon Recoil",
	ZoomMod: "Zoom",
	PunchThroughMod: "Punch Through",
}

  var formElement = document.getElementById("weaponSelect");
  var gunNameElement = document.getElementById("GunNameHere");
  var fireModeElement = document.getElementById("FireModeHere");
  var activeModBoxElement = document.getElementById("activeModBox");
  var inactiveModBoxElement = document.getElementById("inactiveModBox");
  var rivenbarElement = document.getElementById("rivenbar");
  var dummyElement = document.getElementById("dummyElement");
  var weaponInfoElement = document.getElementById("weaponInfo");
  

window.onload = function() {
  document.getElementById('weaponSelect').addEventListener("submit", getWeapon);
  autocomplete(document.getElementById("inputWeapon"), gunList);
  ttkElement = document.getElementById("TTK");
}

function GenerateRiven() {
  var rivenNameElement = document.getElementById("rivenName");
  var rivenCostElement = document.getElementById("rivenCost");
  var rivenEffectType0Element = document.getElementById("rivenEffectType0");
  var rivenEffectValue0Element = document.getElementById("rivenEffectValue0");
  var rivenEffectType1Element = document.getElementById("rivenEffectType1");
  var rivenEffectValue1Element = document.getElementById("rivenEffectValue1");
  var rivenEffectType2Element = document.getElementById("rivenEffectType2");
  var rivenEffectValue2Element = document.getElementById("rivenEffectValue2");
  var rivenEffectType3Element = document.getElementById("rivenEffectType3");
  var rivenEffectValue3Element = document.getElementById("rivenEffectValue3");
  var inactiveModBoxElement = document.getElementById("inactiveModBox");
  rivenTemp = {
    "ModName": rivenNameElement.value === "" ? "Riven" : rivenNameElement.value,
    "ModID": rivenIDSpace,
    "ImageURL": "http://content.warframe.com/MobileExport/Lotus/Interface/Cards/Images/OmegaMod.png",
    "Rarity": "Omega",
    "ModType": actitveGun.Class,
    "Ranks": 9,
    "BaseCost": 10,
    "Polarity": "V",
    "Description": "",
    "Effects": []
  };
  if (rivenEffectType0Element.value != "None" && rivenEffectValue0Element.value.length > 0) {
    rivenTemp.Effects.push( {"Property":rivenEffectType0Element.value, "GainPerRank":rivenEffectValue0Element.value/900});
	rivenTemp.Description += "+" + rivenEffectValue0Element.value + "% " + effectTranslatorMap[rivenEffectType0Element.value] + " ";
  }
  if (rivenEffectType1Element.value != "None" && rivenEffectValue1Element.value.length > 0) {
    rivenTemp.Effects.push( {"Property":rivenEffectType1Element.value, "GainPerRank":rivenEffectValue1Element.value/900});
	rivenTemp.Description += "+" + rivenEffectValue1Element.value + "% " + effectTranslatorMap[rivenEffectType1Element.value] + " ";
  }
  if (rivenEffectType2Element.value != "None" && rivenEffectValue2Element.value.length > 0) {
    rivenTemp.Effects.push( {"Property":rivenEffectType2Element.value, "GainPerRank":rivenEffectValue2Element.value/900});
	rivenTemp.Description += "+" + rivenEffectValue2Element.value + "% " + effectTranslatorMap[rivenEffectType2Element.value] + " ";
  }
  if (rivenEffectType3Element.value != "None" && rivenEffectValue3Element.value.length > 0) {
    rivenTemp.Effects.push( {"Property":rivenEffectType3Element.value, "GainPerRank":rivenEffectValue3Element.value/900});
	rivenTemp.Description += "+" + rivenEffectValue3Element.value + "% " + effectTranslatorMap[rivenEffectType3Element.value] + " ";
  }
  if(rivenTemp.Effects.length > 0) {
    rivenModData[rivenIDSpace] = rivenTemp;
	activeModSet[rivenIDSpace] = rivenTemp;
    inactiveModBoxElement.innerHTML += "<div id='" + rivenIDSpace++ + "Box' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'>" + createModCard(rivenTemp) + "</div>";
	rivenMake.style.display = "none";
	var x = document.getElementById("snackbar");
	x.innerHTML = "Riven Created!"
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}

function createModCard(mod) {
  var modHTML = "";
  var modDescription = mod.Description;
  var dummyElement = document.getElementById("dummyElement");

  for (var eI = 0; eI < mod.Effects.length; eI++) {
    modDescription = modDescription.replace("$" + (eI + 1), Math.floor((mod.Effects[eI].GainPerRank * mod.Ranks * 100).toPrecision(7) * 100) / 100);
  }
  modHTML += "<div class='mod' id='" + mod.ModID + "' draggable='true' ondragstart='drag(event)'><img class='modBorder' src='";
  switch (mod.Rarity) {
    case "Common":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/3/3b/CommonModBorder.png/revision/latest"
      break;
    case "Uncommon":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/4/4e/Mod_Border_Uncommon.png/revision/latest"
      break;
    case "Rare":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/5/55/Mod_Border_Rare.png/revision/latest"
      break;
    case "Legendary":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/d/da/Mod_Border_Legendary.png/revision/latest"
      break;
    case "Omega":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/5/5b/Mod_Border_Omega.png/revision/latest"
      break;
  }
  dummyElement.innerHTML = "<div class='deets' style='font-family:Tahoma;text-align:center;'><div class='modName'>" + mod.ModName + "</div><div class='modEffect'>" + modDescription + "</div></div>";
  modHTML += "' width='256' height='371'><img class='modThumbnail' src='" + mod.ImageURL + "' width='256' height='256' style='clip: rect(0px 248px " + (296 - dummyElement.firstElementChild.scrollHeight) + "px 8px);'><img class='gridBG' src='"
  switch (mod.Rarity) {
    case "Common":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/7/71/Mod_Common_Background.png/revision/latest"
      break;
    case "Uncommon":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/6/69/Mod_Uncommon_Background.png/revision/latest"
      break;
    case "Rare":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/d/d0/Mod_Rare_Background.png/revision/latest"
      break;
    case "Legendary":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/a/ac/Tex_0882.png/revision/latest"
      break;
    case "Omega":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/d/d5/Mod_Omega_Background.png/revision/latest"
      break;
  }
  modHTML += "' width='256' height='512'><div class='ranks'>";
  for (var ranks = 1; ranks < mod.Ranks; ranks++) {
    modHTML += "<img class='activeRankStar' src='https://vignette.wikia.nocookie.net/warframe/images/6/6d/Mod_Rank_Star_Active.png/revision/latest' width='32' height='32'>"
  }
  modHTML += "</div><div class='data " + mod.Rarity + "'><div class='modPolarityCost'>" + (mod.Ranks + mod.BaseCost - 1) + "</div><img class='modPolarity' src='"
  switch (mod.Polarity) {
    case "V":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/b/b2/Madurai_Pol.svg/revision/latest"
      break;
    case "D":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/6/6f/Vazarin_Pol.svg/revision/latest"
      break;
    case "Bar":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/6/60/Naramon_Pol.svg/revision/latest"
      break;
    case "Scratch":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/8/8c/Zenurik_Pol.svg/revision/latest"
      break;
    case "R":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/6/61/Unairu_Pol.svg/revision/latest"
      break;
    case "Y":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/5/5f/Penjaga_Pol.svg/revision/latest"
      break;
    case "U":
      modHTML += "https://vignette.wikia.nocookie.net/warframe/images/a/a8/Umbra_Pol.png/revision/latest"
      break;
  }
  modHTML += "' width='16' height='16'><div class='deets'><div class='modName'>" + mod.ModName + "</div><div class='modEffect'>" + modDescription + "</div></div><div class = modType>" + mod.ModType + "</div></div>";
  modHTML += "</div>";
  return modHTML;
}

function formatOutput(input, formatString = [1, 2, ""]) {
  return (input * formatString[0]).toFixed(formatString[1]) + formatString[2];
}

function changeFireMode(firemode) {
  var dataBlob = document.getElementById(firemode);
  var tabcontent = document.getElementsByClassName("AfireMode");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  if (dataBlob !== null) {
    dataBlob.style.display = 'block';
  }
  activeFireMode = firemode.charAt(firemode.length - 1);
}

function calculateStatistics() {
  var modifiers = {
    ImpactMod: 0,
    PunctureMod: 0,
    SlashMod: 0,
    ColdMod: 0,
    ElectricityMod: 0,
    HeatMod: 0,
    ToxinMod: 0,
    BlastMod: 0,
    CorrosiveMod: 0,
    GasMod: 0,
    MagneticMod: 0,
    RadiationMod: 0,
    ViralMod: 0,
    AccuracyMod: 0,
    MultishotMod: 0,
    FireRateMod: 0,
    CritChanceMod: 0,
    CritMultiplierMod: 0,
    StatusChanceMod: 0,
    MagazineMod: 0,
    ReloadTimeMod: 0,
    AmmoMaxMod: 0,
    DamageMod: 0,
    CorpusFactionMod: 0,
    GrineerFactionMod: 0,
    InfestedFactionMod: 0,
    CorruptedFactionMod: 0
  };
  var HTMLelements = {
    ImpactElement: null,
    PunctureElement: null,
    SlashElement: null,
    ColdElement: null,
    ElectricityElement: null,
    HeatElement: null,
    ToxinElement: null,
    BlastElement: null,
    CorrosiveElement: null,
    GasElement: null,
    MagneticElement: null,
    RadiationElement: null,
    ViralElement: null,
    AccuracyElement: null,
    BulletsElement: null,
    PelletsElement: null,
    FireRateElement: null,
    ChargeTimeElement: null,
    ChargeDelayElement: null,
    BurstFireRateElement: null,
    BurstDelayElement: null,
    BurstCountElement: null,
    CritChanceElement: null,
    CritMultiplierElement: null,
    StatusChanceElement: null,
    StatusEffectsElement: null,
    MagazineElement: null,
    ReloadTimeElement: null,
    AmmoMaxElement: null,
    MarginElement: null,
    DamageElement: null,
    BurstDPSElement: null,
    SustainDPSElement: null,
    FactionCorpusElement: null,
    FactionGrineerElement: null,
    FactionInfestedElement: null,
    FactionCorruptedElement: null,
    StatusEffectsPerSecondElement: null,
    StatusEffectsSustainElement: null,
    FactionCorpusCheckedElement: null,
    FactionGrineerCheckedElement: null,
    FactionInfestedCheckedElement: null,
    FactionCorruptedCheckedElement: null
  };
  var elementCombos = [];

  for (var modSlot = 0; modSlot < 8; modSlot++) {
    var modSlotData = document.getElementById("slot" + modSlot).firstChild;
    if (modSlotData !== null) {
      var mod = activeModSet[modSlotData.id];
      for (var effectIndex = 0; effectIndex < mod.Effects.length; effectIndex++) {
        modifiers[mod.Effects[effectIndex].Property] += mod.Effects[effectIndex].GainPerRank * mod.Ranks;
        if (mod.Effects[effectIndex].Property == "ColdMod" || mod.Effects[effectIndex].Property == "ElectricityMod" || mod.Effects[effectIndex].Property == "HeatMod" || mod.Effects[effectIndex].Property == "ToxinMod") {
          elementCombos.push((mod.Effects[effectIndex].Property).substring(0, 1));
        }
      }
    }
  }

  for (var fireModeIndex = 0; fireModeIndex < actitveGun.FireModes.length; fireModeIndex++) {
    var moddedGunStats = {
      Impact: 0,
      Puncture: 0,
      Slash: 0,
      Cold: 0,
      Electricity: 0,
      Heat: 0,
      Toxin: 0,
      Blast: 0,
      Corrosive: 0,
      Gas: 0,
      Magnetic: 0,
      Radiation: 0,
      Viral: 0,
      Accuracy: 0,
      Bullets: 0,
      Pellets: 0,
      FireRate: 0,
      ChargeTime: 0,
      ChargeDelay: 0,
      BurstFireRate: 0,
      BurstDelay: 0,
      BurstCount: 0,
      CritChance: 0,
      CritMultiplier: 0,
      StatusChance: 0,
      StatusEffects: 0,
      Magazine: 0,
      ReloadTime: 0,
      AmmoMax: 0,
      Damage: 0,
      FactionCorpus: 0,
      FactionGrineer: 0,
      FactionInfested: 0,
      FactionCorrupted: 0,
      BurstDPS: 0,
      SustainDPS: 0,
      StatusEffectsPerSecond: 0,
      StatusEffectsSustain: 0
    };
    var formatStrings = {
      Impact: [1, 2, ""],
      Puncture: [1, 2, ""],
      Slash: [1, 2, ""],
      Cold: [1, 2, ""],
      Electricity: [1, 2, ""],
      Heat: [1, 2, ""],
      Toxin: [1, 2, ""],
      Blast: [1, 2, ""],
      Corrosive: [1, 2, ""],
      Gas: [1, 2, ""],
      Magnetic: [1, 2, ""],
      Radiation: [1, 2, ""],
      Viral: [1, 2, ""],
      Accuracy: [1, 1, ""],
      Bullets: [1, 2, ""],
      Pellets: [1, 2, ""],
      FireRate: [1, 2, ""],
      ChargeTime: [1, 2, "s"],
      ChargeDelay: [1, 2, "s"],
      BurstFireRate: [1, 2, ""],
      BurstDelay: [1, 2, "s"],
      BurstCount: [1, 0, ""],
      CritChance: [100, 0, "%"],
      CritMultiplier: [1, 1, "x"],
      StatusChance: [100, 0, "%"],
      StatusEffects: [1, 2, ""],
      Magazine: [1, 0, ""],
      ReloadTime: [1, 2, "s"],
      AmmoMax: [1, 0, ""],
      Damage: [1, 2, ""],
      FactionCorpus: [100, 0, "%"],
      FactionGrineer: [100, 0, "%"],
      FactionInfested: [100, 0, "%"],
      FactionCorrupted: [100, 0, "%"],
      BurstDPS: [1, 2, ""],
      SustainDPS: [1, 2, ""],
      StatusEffectsPerSecond: [1, 2, ""],
      StatusEffectsSustain: [1, 2, ""]
    };

    if (actitveGun.FireModes[fireModeIndex].DamageTable[3] > 0) {
      elementCombos.push("C");
    } else if (actitveGun.FireModes[fireModeIndex].DamageTable[4] > 0) {
      elementCombos.push("E");
    } else if (actitveGun.FireModes[fireModeIndex].DamageTable[5] > 0) {
      elementCombos.push("H");
    } else if (actitveGun.FireModes[fireModeIndex].DamageTable[6] > 0) {
      elementCombos.push("T");
    }

    elementCombos = elementCombos.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });

    moddedGunStats.Impact = actitveGun.FireModes[fireModeIndex].DamageTable[0] * (1 + modifiers.DamageMod);
    moddedGunStats.Puncture = actitveGun.FireModes[fireModeIndex].DamageTable[1] * (1 + modifiers.DamageMod);
    moddedGunStats.Slash = actitveGun.FireModes[fireModeIndex].DamageTable[2] * (1 + modifiers.DamageMod);
    moddedGunStats.Cold = actitveGun.FireModes[fireModeIndex].DamageTable[3] * (1 + modifiers.DamageMod);
    moddedGunStats.Electricity = actitveGun.FireModes[fireModeIndex].DamageTable[4] * (1 + modifiers.DamageMod);
    moddedGunStats.Heat = actitveGun.FireModes[fireModeIndex].DamageTable[5] * (1 + modifiers.DamageMod);
    moddedGunStats.Toxin = actitveGun.FireModes[fireModeIndex].DamageTable[6] * (1 + modifiers.DamageMod);
    moddedGunStats.Blast = actitveGun.FireModes[fireModeIndex].DamageTable[7] * (1 + modifiers.DamageMod);
    moddedGunStats.Corrosive = actitveGun.FireModes[fireModeIndex].DamageTable[8] * (1 + modifiers.DamageMod);
    moddedGunStats.Gas = actitveGun.FireModes[fireModeIndex].DamageTable[9] * (1 + modifiers.DamageMod);
    moddedGunStats.Magnetic = actitveGun.FireModes[fireModeIndex].DamageTable[10] * (1 + modifiers.DamageMod);
    moddedGunStats.Radiation = actitveGun.FireModes[fireModeIndex].DamageTable[11] * (1 + modifiers.DamageMod);
    moddedGunStats.Viral = actitveGun.FireModes[fireModeIndex].DamageTable[12] * (1 + modifiers.DamageMod);

    baseDamageNoMod[fireModeIndex] = moddedGunStats.Impact + moddedGunStats.Puncture + moddedGunStats.Slash + moddedGunStats.Cold + moddedGunStats.Electricity + moddedGunStats.Heat + moddedGunStats.Toxin + moddedGunStats.Blast + moddedGunStats.Corrosive + moddedGunStats.Gas + moddedGunStats.Magnetic + moddedGunStats.Radiation + moddedGunStats.Viral;

    moddedGunStats.Impact = moddedGunStats.Impact * (1 + modifiers.ImpactMod);
    moddedGunStats.Puncture = moddedGunStats.Puncture * (1 + modifiers.PunctureMod);
    moddedGunStats.Slash = moddedGunStats.Slash * (1 + modifiers.SlashMod);
    moddedGunStats.Cold = (moddedGunStats.Cold + (baseDamageNoMod[fireModeIndex] * modifiers.ColdMod));
    moddedGunStats.Electricity = (moddedGunStats.Electricity + (baseDamageNoMod[fireModeIndex] * modifiers.ElectricityMod));
    moddedGunStats.Heat = (moddedGunStats.Heat + (baseDamageNoMod[fireModeIndex] * modifiers.HeatMod));
    moddedGunStats.Toxin = (moddedGunStats.Toxin + (baseDamageNoMod[fireModeIndex] * modifiers.ToxinMod));

    switch (elementCombos.length) {
      case 0:
      case 1:
        break;
      case 2:
      case 3:
        if (elementCombos[0] == "C") {
          if (elementCombos[1] == "E") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Heat = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "E") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "H") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Heat = 0;
          }
          if (elementCombos[1] == "E") {
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "T") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "E") {
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        }
        break;
      case 4:
        if (elementCombos[0] == "C") {
          if (elementCombos[1] == "E") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "E") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "H") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "E") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "T") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        } else if (elementCombos[0] == "T") {
          if (elementCombos[1] == "C") {
            moddedGunStats.Viral += moddedGunStats.Cold + moddedGunStats.Toxin;
            moddedGunStats.Radiation += moddedGunStats.Electricity + moddedGunStats.Heat;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "E") {
            moddedGunStats.Blast += moddedGunStats.Cold + moddedGunStats.Heat;
            moddedGunStats.Corrosive += moddedGunStats.Electricity + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
          if (elementCombos[1] == "H") {
            moddedGunStats.Magnetic += moddedGunStats.Cold + moddedGunStats.Electricity;
            moddedGunStats.Gas += moddedGunStats.Heat + moddedGunStats.Toxin;
            moddedGunStats.Cold = 0;
            moddedGunStats.Electricity = 0;
            moddedGunStats.Heat = 0;
            moddedGunStats.Toxin = 0;
          }
        }
        break;
    }

    HTMLelements.FactionCorpusCheckedElement = document.getElementById("FireMode" + fireModeIndex + "FactionCorpusChecked");
    HTMLelements.FactionGrineerCheckedElement = document.getElementById("FireMode" + fireModeIndex + "FactionGrineerChecked");
    HTMLelements.FactionInfestedCheckedElement = document.getElementById("FireMode" + fireModeIndex + "FactionInfestedChecked");
    HTMLelements.FactionCorruptedCheckedElement = document.getElementById("FireMode" + fireModeIndex + "FactionCorruptedChecked");

    moddedGunStats.FactionCorpus = HTMLelements.FactionCorpusCheckedElement.checked === true ? modifiers.CorpusFactionMod : 0;
    moddedGunStats.FactionGrineer = HTMLelements.FactionGrineerCheckedElement.checked === true ? modifiers.GrineerFactionMod : 0;
    moddedGunStats.FactionInfested = HTMLelements.FactionInfestedCheckedElement.checked === true ? modifiers.InfestedFactionMod : 0;
    moddedGunStats.FactionCorrupted = HTMLelements.FactionCorruptedCheckedElement.checked === true ? modifiers.CorruptedFactionMod : 0;

    var FactionMod = moddedGunStats.FactionCorpus + moddedGunStats.FactionCorrupted + moddedGunStats.FactionGrineer + moddedGunStats.FactionInfested;

    moddedGunStats.FactionCorpus = modifiers.CorpusFactionMod;
    moddedGunStats.FactionGrineer = modifiers.GrineerFactionMod;
    moddedGunStats.FactionCorrupted = modifiers.CorruptedFactionMod;
    moddedGunStats.FactionInfested = modifiers.InfestedFactionMod;

    moddedGunStats.Impact *= (1 + FactionMod);
    moddedGunStats.Puncture *= (1 + FactionMod);
    moddedGunStats.Slash *= (1 + FactionMod);
    moddedGunStats.Cold *= (1 + FactionMod);
    moddedGunStats.Electricity *= (1 + FactionMod);
    moddedGunStats.Heat *= (1 + FactionMod);
    moddedGunStats.Toxin *= (1 + FactionMod);
    moddedGunStats.Blast *= (1 + FactionMod);
    moddedGunStats.Corrosive *= (1 + FactionMod);
    moddedGunStats.Gas *= (1 + FactionMod);
    moddedGunStats.Magnetic *= (1 + FactionMod);
    moddedGunStats.Radiation *= (1 + FactionMod);
    moddedGunStats.Viral *= (1 + FactionMod);

    moddedGunStats.Damage = moddedGunStats.Impact + moddedGunStats.Puncture + moddedGunStats.Slash + moddedGunStats.Cold + moddedGunStats.Electricity + moddedGunStats.Heat + moddedGunStats.Toxin + moddedGunStats.Blast + moddedGunStats.Corrosive + moddedGunStats.Gas + moddedGunStats.Magnetic + moddedGunStats.Radiation + moddedGunStats.Viral;
    moddedGunStats.Damage = moddedGunStats.Damage * (1 + moddedGunStats.CritChance * (moddedGunStats.CritMultiplier - 1));

    moddedGunStats.Accuracy = actitveGun.FireModes[fireModeIndex].Accuracy * (1 + modifiers.AccuracyMod);
    moddedGunStats.Magazine = actitveGun.MagazineSize * (1 + modifiers.MagazineMod);
    moddedGunStats.ReloadTime = actitveGun.ReloadTime / (1 + modifiers.ReloadTimeMod);
    moddedGunStats.AmmoMax = actitveGun.AmmoMax * (1 + modifiers.AmmoMaxMod);
    moddedGunStats.CritChance = actitveGun.FireModes[fireModeIndex].CritChance * (1 + modifiers.CritChanceMod);
    moddedGunStats.CritMultiplier = actitveGun.FireModes[fireModeIndex].CritMultiplier * (1 + modifiers.CritMultiplierMod);
    moddedGunStats.Damage = moddedGunStats.Damage * (1 + moddedGunStats.CritChance * (moddedGunStats.CritMultiplier - 1));
    moddedGunStats.StatusChance = Math.min(actitveGun.FireModes[fireModeIndex].StatusChance * (1 + modifiers.StatusChanceMod), 1);

    if (actitveGun.FireModes[fireModeIndex].Pellets > 0) {
      moddedGunStats.Pellets = actitveGun.FireModes[fireModeIndex].Pellets * (1 + modifiers.MultishotMod);
      shotgunStatusPellet[fireModeIndex] = 1 - Math.pow((1 - moddedGunStats.StatusChance), (1 / moddedGunStats.Pellets));
      moddedGunStats.StatusChance = shotgunStatusPellet[fireModeIndex];
      moddedGunStats.StatusEffects = moddedGunStats.StatusChance * moddedGunStats.Pellets;
      moddedGunStats.StatusChance = Math.min(actitveGun.FireModes[fireModeIndex].StatusChance * (1 + modifiers.StatusChanceMod), 1);
      moddedGunStats.Damage *= (1 + modifiers.MultishotMod);
    } else if (actitveGun.FireModes[fireModeIndex].Bullets > 0) {
      moddedGunStats.Bullets = actitveGun.FireModes[fireModeIndex].Bullets * (1 + modifiers.MultishotMod);
      moddedGunStats.StatusEffects = moddedGunStats.StatusChance * moddedGunStats.Bullets;
      moddedGunStats.Damage *= moddedGunStats.Bullets;
    }

    if (actitveGun.FireModes[fireModeIndex].TriggerType.includes("Auto")) {
      moddedGunStats.FireRate = actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod);

    } else if (actitveGun.FireModes[fireModeIndex].TriggerType.includes("Burst")) {
      formatStrings.FireRate = [1, 2, "?"];
      moddedGunStats.BurstCount = actitveGun.FireModes[fireModeIndex].BurstCount;
      moddedGunStats.BurstFireRate = actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod);
      moddedGunStats.BurstDelay = 1 / (actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod));
      moddedGunStats.FireRate = actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod) - (moddedGunStats.BurstDelay / moddedGunStats.BurstCount);
    } else if (actitveGun.FireModes[fireModeIndex].TriggerType.includes("Charge")) {
      moddedGunStats.ChargeTime = actitveGun.FireModes[fireModeIndex].ChargeTime / (1 + modifiers.FireRateMod);
      moddedGunStats.ChargeDelay = 1 / actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod);
      moddedGunStats.FireRate = 1 / (moddedGunStats.ChargeTime + moddedGunStats.ChargeDelay);
    } else if (actitveGun.FireModes[fireModeIndex].TriggerType.includes("Held")) {
      moddedGunStats.FireRate = actitveGun.FireModes[fireModeIndex].FireRate * (1 + modifiers.FireRateMod);
    }

    moddedGunStats.BurstDPS = moddedGunStats.Damage * moddedGunStats.FireRate;
    moddedGunStats.SustainDPS = (moddedGunStats.Damage * moddedGunStats.Magazine) / ((moddedGunStats.Magazine - 1) / moddedGunStats.FireRate + moddedGunStats.ReloadTime);
    moddedGunStats.StatusEffectsPerSecond = moddedGunStats.StatusEffects * moddedGunStats.FireRate;
    moddedGunStats.StatusEffectsSustain = (moddedGunStats.StatusEffects * moddedGunStats.Magazine) / ((moddedGunStats.Magazine - 1) / moddedGunStats.FireRate + moddedGunStats.ReloadTime);

    for (var stat in moddedGunStats) {
      HTMLelements[stat + "Element"] = document.getElementById("FireMode" + fireModeIndex + stat)
      if (moddedGunStats[stat] > 0) {
        HTMLelements[stat + "Element"].firstElementChild.innerHTML = formatOutput(moddedGunStats[stat], formatStrings[stat]);
        HTMLelements[stat + "Element"].style.display = "block"
      } else {
        HTMLelements[stat + "Element"].style.display = "none"
      }
    }
    allStats[fireModeIndex] = moddedGunStats;
  }
}

function getWeapon() {
  var fireModeCount;
  var query;
	
	var fireModeElementOutput = "";
  var inactiveModBoxElementOutput = "";
	
  activeModBoxElement.innerHTML = defaultModBox;
  inactiveModBoxElement.innerHTML = "";
  fireModeElement.innerHTML = "";

  query = formElement.elements[0].value;
  if (gunData[query] !== undefined) {
    actitveGun = gunData[query];
    gunNameElement.innerHTML = "<h2>" + actitveGun.GunName + "</h2>"
    activeModBoxElement.style.display = "block";
    rivenbarElement.style.display = "block";
    weaponInfoElement.style.display = "block";
    if (modData[actitveGun.Class] !== undefined) {
      activeModSet = modData[actitveGun.Class];
      dummyElement.style = "display:block;"
      for (var mod in activeModSet) {
        inactiveModBoxElementOutput += "<div id='" + activeModSet[mod].ModID + "Box' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'>" + createModCard(activeModSet[mod]) + "</div>";
      }
      inactiveModBoxElement.innerHTML = inactiveModBoxElementOutput;
      dummyElement.innerHTML = "";
      dummyElement.style = "display:none;";
    } else {
      activeModSet = null;
    }
    fireModeCount = actitveGun.FireModes.length;
    for (var fireModeIndex = 0; fireModeIndex < fireModeCount; fireModeIndex++) {
      fireModeElementOutput += "<div class='fireModeTab' style='width:" + 100 / fireModeCount + "%;'><label for='fireModeRadio" + fireModeIndex + "'>" + actitveGun.FireModes[fireModeIndex].AttackName.toUpperCase() + "</label><input id='fireModeRadio" + fireModeIndex + "' name='fireMode' type='radio' onclick='changeFireMode(\"FireMode" + fireModeIndex + "\")'" + (fireModeIndex === 0 ? "checked='checked'" : "") + "></input></div>";
    }
    fireModeElement.innerHTML = fireModeElementOutput;
    changeFireMode("FireMode" + 0);
    calculateStatistics();
  } else {
    actitveGun = null;
    activeModSet = null;
    gunNameElement.innerHTML = "No results found for \"" + query + "\"";
    activeModBoxElement.style.display = "none";
    weaponInfoElement.style.display = "none";
    rivenbarElement.style.display = "none";
  }
	console.log(actitveGun);
}

function GenerateWeapon() {
	var weaponMakeNameElement = document.getElementById("weaponMakeName").value;
	var weaponMakeClassElement = document.querySelector('input[name="weaponMakeType"]:checked').value;
	var weaponMakeBulletsElement = document.getElementById("weaponMakeBullets").value;
	var weaponMakeFireRateElement = document.getElementById("weaponMakeFireRate").value;
	var weaponMakeCriticalChanceElement = document.getElementById("weaponMakeCriticalChance").value / 100;
	var weaponMakeCriticalMultiplierElement = document.getElementById("weaponMakeCriticalMultiplier").value;
	var weaponMakeStatusChanceElement = document.getElementById("weaponMakeStatusChance").value / 100;
	var weaponMakeAccuracyElement = document.getElementById("weaponMakeAccuracy").value;
	var weaponMakeImpactElement = document.getElementById("weaponMakeImpact").value;
	var weaponMakePunctureElement = document.getElementById("weaponMakePuncture").value;
	var weaponMakeSlashElement = document.getElementById("weaponMakeSlash").value;
	var weaponMakeColdElement = document.getElementById("weaponMakeCold").value;
	var weaponMakeElectricityElement = document.getElementById("weaponMakeElectricity").value;
	var weaponMakeHeatElement = document.getElementById("weaponMakeHeat").value;
	var weaponMakeToxinElement = document.getElementById("weaponMakeToxin").value;
	var weaponMakeBlastElement = document.getElementById("weaponMakeBlast").value;
	var weaponMakeCorrosiveElement = document.getElementById("weaponMakeCorrosive").value;
	var weaponMakeGasElement = document.getElementById("weaponMakeGas").value;
	var weaponMakeMagneticElement = document.getElementById("weaponMakeMagnetic").value;
	var weaponMakeRadiationElement = document.getElementById("weaponMakeRadiation").value;
	var weaponMakeViralElement = document.getElementById("weaponMakeViral").value;
	var weaponMakeMagazineSizeElement = document.getElementById("weaponMakeMagazineSize").value;
	var weaponMakeAmmoMaxElement = document.getElementById("weaponMakeAmmoMax").value;
	var weaponMakeReloadTimeElement = document.getElementById("weaponMakeReloadTime").value;
	
	var fireModeElementOutput = "";
    var inactiveModBoxElementOutput = "";
	
	actitveGun = {
		"GunName": weaponMakeNameElement.length > 0 ? weaponMakeNameElement : "Gun",
		"Class": weaponMakeClassElement,
		"FireModes": [{
			"AttackName": "Primary Fire",
			"Bullets": isNaN(weaponMakeBulletsElement) || weaponMakeBulletsElement <= 0 ? 1 : weaponMakeBulletsElement,
			"FireRate": isNaN(weaponMakeFireRateElement) || weaponMakeFireRateElement <= 0 ? 1 : weaponMakeFireRateElement,
			"CritChance": isNaN(weaponMakeCriticalChanceElement) || weaponMakeCriticalChanceElement <= 0 ? 0 : weaponMakeCriticalChanceElement,
			"CritMultiplier": isNaN(weaponMakeCriticalMultiplierElement) || weaponMakeCriticalMultiplierElement <= 0 ? 1 : weaponMakeCriticalMultiplierElement,
			"StatusChance": isNaN(weaponMakeStatusChanceElement) || weaponMakeStatusChanceElement <= 0 ? 0 : weaponMakeStatusChanceElement,
			"Accuracy": isNaN(weaponMakeAccuracyElement) || weaponMakeAccuracyElement <= 0 ? 0 : weaponMakeAccuracyElement,
			"TriggerType": "Semi-Auto",
			"DamageTable": [weaponMakeImpactElement, weaponMakePunctureElement, weaponMakeSlashElement, weaponMakeColdElement, weaponMakeElectricityElement, weaponMakeHeatElement, weaponMakeToxinElement, weaponMakeBlastElement, weaponMakeCorrosiveElement, weaponMakeGasElement, weaponMakeMagneticElement, weaponMakeRadiationElement, weaponMakeViralElement],
		}],
		"MagazineSize": isNaN(weaponMakeMagazineSizeElement) || weaponMakeMagazineSizeElement <= 0 ? 1 : weaponMakeMagazineSizeElement,
		"AmmoMax": isNaN(weaponMakeAmmoMaxElement) || weaponMakeAmmoMaxElement <= 0 ? 1 : weaponMakeAmmoMaxElement,
		"ReloadTime": isNaN(weaponMakeReloadTimeElement) || weaponMakeReloadTimeElement <= 0 ? 1 : weaponMakeReloadTimeElement
	};
	weaponMakeModal.style.display = "none";
	console.log(actitveGun);
	
	activeModBoxElement.innerHTML = defaultModBox;
    inactiveModBoxElement.innerHTML = "";
    fireModeElement.innerHTML = "";
	
	gunNameElement.innerHTML = "<h2>" + actitveGun.GunName + "</h2>"
    activeModBoxElement.style.display = "block";
    rivenbarElement.style.display = "block";
    weaponInfoElement.style.display = "block";
    if (modData[actitveGun.Class] !== undefined) {
      activeModSet = modData[actitveGun.Class];
      dummyElement.style = "display:block;"
      for (var mod in activeModSet) {
        inactiveModBoxElementOutput += "<div id='" + activeModSet[mod].ModID + "Box' class='modslot' ondrop='drop(event)' ondragover='allowDrop(event)'>" + createModCard(activeModSet[mod]) + "</div>";
      }
      inactiveModBoxElement.innerHTML = inactiveModBoxElementOutput;
      dummyElement.innerHTML = "";
      dummyElement.style = "display:none;";
    } else {
      activeModSet = null;
    }
    fireModeCount = actitveGun.FireModes.length;
    for (var fireModeIndex = 0; fireModeIndex < fireModeCount; fireModeIndex++) {
      fireModeElementOutput += "<div class='fireModeTab' style='width:" + 100 / fireModeCount + "%;'><label for='fireModeRadio" + fireModeIndex + "'>" + actitveGun.FireModes[fireModeIndex].AttackName.toUpperCase() + "</label><input id='fireModeRadio" + fireModeIndex + "' name='fireMode' type='radio' onclick='changeFireMode(\"FireMode" + fireModeIndex + "\")'" + (fireModeIndex === 0 ? "checked='checked'" : "") + "></input></div>";
    }
    fireModeElement.innerHTML = fireModeElementOutput;
    changeFireMode("FireMode" + 0);
    calculateStatistics();
	
	var x = document.getElementById("snackbar");
	x.innerHTML = "Weapon Created!"
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showMakeWeapon() {
  weaponMakeModal.style.display = "block";
}

function showSimulations() {
  modal.style.display = "block";
}

function showRivenMaker() {
  rivenMake.style.display = "block";
}

function Simulate() {
  var targetScaled = {
    "HealthValue": 0,
    "ShieldValue": 0,
    "ArmorValue": 0
  }
  var baseDamage = allStats[activeFireMode].Impact + allStats[activeFireMode].Puncture + allStats[activeFireMode].Slash + allStats[activeFireMode].Cold + allStats[activeFireMode].Electricity + allStats[activeFireMode].Heat + allStats[activeFireMode].Toxin + allStats[activeFireMode].Blast + allStats[activeFireMode].Corrosive + allStats[activeFireMode].Gas + allStats[activeFireMode].Magnetic + allStats[activeFireMode].Radiation + allStats[activeFireMode].Viral;
  var impactRatio = parseFloat((allStats[activeFireMode].Impact / baseDamage).toPrecision(15));
  var punctureRatio = parseFloat((allStats[activeFireMode].Puncture / baseDamage).toPrecision(15));
  var slashRatio = parseFloat((allStats[activeFireMode].Slash / baseDamage).toPrecision(15));
  var coldRatio = parseFloat((allStats[activeFireMode].Cold / baseDamage).toPrecision(15));
  var electricityRatio = parseFloat((allStats[activeFireMode].Electricity / baseDamage).toPrecision(15));
  var heatRatio = parseFloat((allStats[activeFireMode].Heat / baseDamage).toPrecision(15));
  var toxinRatio = parseFloat((allStats[activeFireMode].Toxin / baseDamage).toPrecision(15));
  var blastRatio = parseFloat((allStats[activeFireMode].Blast / baseDamage).toPrecision(15));
  var corrosiveRatio = parseFloat((allStats[activeFireMode].Corrosive / baseDamage).toPrecision(15));
  var gasRatio = parseFloat((allStats[activeFireMode].Gas / baseDamage).toPrecision(15));
  var magneticRatio = parseFloat((allStats[activeFireMode].Magnetic / baseDamage).toPrecision(15));
  var radiationRatio = parseFloat((allStats[activeFireMode].Radiation / baseDamage).toPrecision(15));
  var viralRatio = parseFloat((allStats[activeFireMode].Viral / baseDamage).toPrecision(15));
  var critChance = allStats[activeFireMode].CritChance;
  var critLevel;
  var bullets;
  var factionSlash = 1 + allStats[activeFireMode].FactionCorpus + allStats[activeFireMode].FactionCorrupted + allStats[activeFireMode].FactionGrineer + allStats[activeFireMode].FactionInfested;

  var bulletChance = allStats[activeFireMode].Bullets - 1;
  for (critLevel = 1; critChance > 1; critLevel++) {
    critChance -= 1;
  }
  for (bullets = 1; bulletChance > 1; bullets++) {
    bulletChance -= 1;
  }
  var procRanges = [0,
    impactRatio,
    impactRatio + punctureRatio,
    impactRatio + punctureRatio + slashRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio + corrosiveRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio + corrosiveRatio + gasRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio + corrosiveRatio + gasRatio + magneticRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio + corrosiveRatio + gasRatio + magneticRatio + radiationRatio,
    impactRatio + punctureRatio + slashRatio + coldRatio + electricityRatio + heatRatio + toxinRatio + blastRatio + corrosiveRatio + gasRatio + magneticRatio + radiationRatio + viralRatio
  ];
  var procName = ["Impact", "Puncture", "Slash", "Cold", "Electricity", "Heat", "Toxin", "Blast", "Corrosive", "Gas", "Magnetic", "Radiation", "Viral"];
  var ttkTimes = [];
  var ttkFinal = 0;
  var damages = [];
  var slashes = [];
  var totalSlash = 0;
  var totalDamage = 0;

  targetScaled.HealthValue = targetData["Elite Lancer"].HealthValue * (1 + Math.pow((targetLevel - targetData["Elite Lancer"].BaseLevel), 2) * 0.015);
  targetScaled.ShieldValue = targetData["Elite Lancer"].ShieldValue * (1 + Math.pow((targetLevel - targetData["Elite Lancer"].BaseLevel), 2) * 0.0075);
  targetScaled.ArmorValue = targetData["Elite Lancer"].ArmorValue * (1 + Math.pow((targetLevel - targetData["Elite Lancer"].BaseLevel), 1.75) * 0.005);
  var t0 = performance.now();

  for (var i = 0; i < simulations; i++) {
    var simTarget = {
      "health": targetScaled.HealthValue,
      "armor": targetScaled.ArmorValue,
      "shield": targetScaled.ShieldValue,
      "healthIndex": targetTypes.indexOf(targetData["Elite Lancer"].HealthType),
      "armorIndex": targetTypes.indexOf(targetData["Elite Lancer"].ArmorType),
      "shieldIndex": targetTypes.indexOf(targetData["Elite Lancer"].ShieldType)
    }
    var magazine = allStats[activeFireMode].Magazine;
    var fireInterval = 1 / allStats[activeFireMode].FireRate;
    var nextTrigger = 0;
    var lastProc = 0;
    var procs = [];
    var damageCount = 0;
    var slashCount = 0;
    var viraled = false;
    var viraledHealth = 0;
    var viralDecay = 0;

    while (simTarget.health > 0) {
      var multishots = bullets;
      for (var proc in procs) {
        while (procs[proc][0] < nextTrigger && simTarget.health > 0) {
          if (viralDecay !== 0 && viralDecay < procs[proc][0]) {
            viralDecay = 0;
            viraled = false;
            simTarget.health += viraledHealth;
          }
          simTarget.health -= procs[proc][1];
          slashCount += procs[proc][1];
          procs[proc][2]--;
          lastProc = procs[proc][0];
          if (procs[proc][2] !== 0) {
            procs[proc][0] += 7 / 6;
          } else {
            procs.splice(proc, 1);
            break;
          }
        }
      }
      if (simTarget.health < 0) {
        ttkTimes.push(lastProc)
        damages.push(damageCount)
        slashes.push(slashCount)
        break;
      }
      magazine--;
      if (viralDecay !== 0 && viralDecay < nextTrigger) {
        viralDecay = 0;
        viraled = false;
        simTarget.health += viraledHealth;
      }
      if (Math.random() < bulletChance) {
        multishots += 1;
      }
      for (var b = 0; b < multishots; b++) {
        if (Math.random() < overallAccuracry) {
          var damageInstance = calculateDamage(simTarget, critChance, critLevel)
          simTarget.health -= damageInstance.healthTotal;
          damageCount += damageInstance.healthTotal;
          for (var p = 0; p < allStats[activeFireMode].Pellets; p++) {
            if (Math.random() < shotgunStatusPellet[activeFireMode]) {
              var procTypeShotgun = Math.random();
              for (var pris = 0; pris < 13; pris++) {
                if (procRanges[pris] < procTypeShotgun && procTypeShotgun < procRanges[pris + 1]) {
                  if (pris === 2) {
                    var slashTickShotgun = baseDamageNoMod[activeFireMode] * damageInstance.headcrit * factionSlash * factionSlash * 0.35 / allStats[activeFireMode].Pellets;
                    simTarget.health -= slashTickShotgun;
                    slashCount += slashTickShotgun;
                    procs.push([nextTrigger + (6 / 7), slashTickShotgun, 6]);
                  }
                  if (pris === 8) {
                    simTarget.armor *= 0.75;
                  }
                  if (pris === 12) {
                    viralDecay = nextTrigger + 6;
                    if (viraled === false) {
                      viraledHealth = simTarget.health / 2;
                      simTarget.health = viraledHealth;
                      viraled = true;
                    }
                  }
                }
              }
            }
          }
          if (allStats[activeFireMode].Pellets === 0 && Math.random() < allStats[activeFireMode].StatusChance) {
            var procType = Math.random();
            for (var pri = 0; pri < 13; pri++) {
              if (procRanges[pri] < procType && procType < procRanges[pri + 1]) {
                if (pri === 2) {
                  var slashTick = baseDamageNoMod[activeFireMode] * damageInstance.headcrit * factionSlash * factionSlash * 0.35
                  simTarget.health -= slashTick;
                  slashCount += slashTick;
                  procs.push([nextTrigger + (6 / 7), slashTick, 6]);
                }
                if (pri === 8) {
                  simTarget.armor *= 0.75;
                }
                if (pri === 12) {
                  viralDecay = nextTrigger + 6;
                  if (viraled === false) {
                    viraledHealth = simTarget.health / 2;
                    simTarget.health = viraledHealth;
                    viraled = true;
                  }
                }
              }
            }
          }
        }
      }
      if (simTarget.health > 0) {
        if (magazine === 0) {
          nextTrigger += allStats[activeFireMode].ReloadTime;
          magazine = allStats[activeFireMode].Magazine;
        } else {
          nextTrigger += fireInterval;
        }
      } else {
        ttkTimes.push(nextTrigger)
        damages.push(damageCount)
        slashes.push(slashCount)
      }
    }
  }

  var t1 = performance.now();
  console.log("Performed " + simulations + " simulations in " + (t1 - t0) + " milliseconds.")
  var totalTimes = 0;
  for (var it = 0; it < ttkTimes.length; it++) {
    totalTimes += ttkTimes[it];
    totalSlash += slashes[it];
    totalDamage += damages[it];
  }
  var avgTimes = totalTimes / ttkTimes.length;
  var avgSlash = totalSlash / ttkTimes.length;
  var avgDamage = totalDamage / ttkTimes.length
  ttkFinal = avgTimes
  ttkElement.innerHTML = "TTK: " + ttkFinal + "s";
  console.log("Average damage done through slash procs: " + avgSlash)
  console.log("Average damage done through bullets: " + avgDamage)
}

function updateTarget(simTarget, damage) {

}

function calculateDamage(simTarget, critChance, critLevel) {
  var damageInstance = {
    "baseTotal": 0,
    "healthTotal": 0,
    "shieldTotal": 0,
    "base": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "health": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "shield": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "headshot": 1,
    "crit": 1,
    "headcrit": 0
  };
  if (Math.random() < headshotAccuracy) {
    damageInstance.headshot = 2;
  }
  if (Math.random() < allStats[activeFireMode].CritChance) {
    damageInstance.crit = critLevel * (allStats[activeFireMode].CritMultiplier - 1) + 1;
    damageInstance.headshot = damageInstance.headshot > 1 ? 4 : 1;
  }
  damageInstance.headcrit = damageInstance.headshot * damageInstance.crit;
  damageInstance.base[0] = allStats[activeFireMode].Impact * damageInstance.headcrit;
  damageInstance.base[1] = allStats[activeFireMode].Puncture * damageInstance.headcrit;
  damageInstance.base[2] = allStats[activeFireMode].Slash * damageInstance.headcrit;
  damageInstance.base[3] = allStats[activeFireMode].Cold * damageInstance.headcrit;
  damageInstance.base[4] = allStats[activeFireMode].Electricity * damageInstance.headcrit;
  damageInstance.base[5] = allStats[activeFireMode].Heat * damageInstance.headcrit;
  damageInstance.base[6] = allStats[activeFireMode].Toxin * damageInstance.headcrit;
  damageInstance.base[7] = allStats[activeFireMode].Blast * damageInstance.headcrit;
  damageInstance.base[8] = allStats[activeFireMode].Corrosive * damageInstance.headcrit;
  damageInstance.base[9] = allStats[activeFireMode].Gas * damageInstance.headcrit;
  damageInstance.base[10] = allStats[activeFireMode].Magnetic * damageInstance.headcrit;
  damageInstance.base[11] = allStats[activeFireMode].Radiation * damageInstance.headcrit;
  damageInstance.base[12] = allStats[activeFireMode].Viral * damageInstance.headcrit;

  if (simTarget.armorIndex === -1 || simTarget.armor < 1) {
    damageInstance.health[0] = damageInstance.base[0] * (1 + damageResistances.Impact[simTarget.healthIndex]);
    damageInstance.health[1] = damageInstance.base[1] * (1 + damageResistances.Puncture[simTarget.healthIndex]);
    damageInstance.health[2] = damageInstance.base[2] * (1 + damageResistances.Slash[simTarget.healthIndex]);
    damageInstance.health[3] = damageInstance.base[3] * (1 + damageResistances.Cold[simTarget.healthIndex]);
    damageInstance.health[4] = damageInstance.base[4] * (1 + damageResistances.Electricity[simTarget.healthIndex]);
    damageInstance.health[5] = damageInstance.base[5] * (1 + damageResistances.Heat[simTarget.healthIndex]);
    damageInstance.health[6] = damageInstance.base[6] * (1 + damageResistances.Toxin[simTarget.healthIndex]);
    damageInstance.health[7] = damageInstance.base[7] * (1 + damageResistances.Blast[simTarget.healthIndex]);
    damageInstance.health[8] = damageInstance.base[8] * (1 + damageResistances.Corrosive[simTarget.healthIndex]);
    damageInstance.health[9] = damageInstance.base[9] * (1 + damageResistances.Gas[simTarget.healthIndex]);
    damageInstance.health[10] = damageInstance.base[10] * (1 + damageResistances.Magnetic[simTarget.healthIndex]);
    damageInstance.health[11] = damageInstance.base[11] * (1 + damageResistances.Radiation[simTarget.healthIndex]);
    damageInstance.health[12] = damageInstance.base[12] * (1 + damageResistances.Viral[simTarget.healthIndex]);
  } else {
    if (simTarget.armor > 1 && simTarget.armor != lastArmor) {
      lastResist[0] = ((1 + damageResistances.Impact[simTarget.healthIndex]) * (1 + damageResistances.Impact[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Impact[simTarget.armorIndex])) / 300));
      lastResist[1] = ((1 + damageResistances.Puncture[simTarget.healthIndex]) * (1 + damageResistances.Puncture[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Puncture[simTarget.armorIndex])) / 300));
      lastResist[2] = ((1 + damageResistances.Slash[simTarget.healthIndex]) * (1 + damageResistances.Slash[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Slash[simTarget.armorIndex])) / 300));
      lastResist[3] = ((1 + damageResistances.Cold[simTarget.healthIndex]) * (1 + damageResistances.Cold[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Cold[simTarget.armorIndex])) / 300));
      lastResist[4] = ((1 + damageResistances.Electricity[simTarget.healthIndex]) * (1 + damageResistances.Electricity[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Electricity[simTarget.armorIndex])) / 300));
      lastResist[5] = ((1 + damageResistances.Heat[simTarget.healthIndex]) * (1 + damageResistances.Heat[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Heat[simTarget.armorIndex])) / 300));
      lastResist[6] = ((1 + damageResistances.Toxin[simTarget.healthIndex]) * (1 + damageResistances.Toxin[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Toxin[simTarget.armorIndex])) / 300));
      lastResist[7] = ((1 + damageResistances.Blast[simTarget.healthIndex]) * (1 + damageResistances.Blast[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Blast[simTarget.armorIndex])) / 300));
      lastResist[8] = ((1 + damageResistances.Corrosive[simTarget.healthIndex]) * (1 + damageResistances.Corrosive[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Corrosive[simTarget.armorIndex])) / 300))
      lastResist[9] = ((1 + damageResistances.Gas[simTarget.healthIndex]) * (1 + damageResistances.Gas[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Gas[simTarget.armorIndex])) / 300));
      lastResist[10] = ((1 + damageResistances.Magnetic[simTarget.healthIndex]) * (1 + damageResistances.Magnetic[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Magnetic[simTarget.armorIndex])) / 300));
      lastResist[11] = ((1 + damageResistances.Radiation[simTarget.healthIndex]) * (1 + damageResistances.Radiation[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Radiation[simTarget.armorIndex])) / 300));
      lastResist[12] = ((1 + damageResistances.Viral[simTarget.healthIndex]) * (1 + damageResistances.Viral[simTarget.armorIndex])) / (1 + ((simTarget.armor * (1 - damageResistances.Viral[simTarget.armorIndex])) / 300));

      lastArmor = simTarget.armor;
    }
    damageInstance.health[0] = damageInstance.base[0] * lastResist[0];
    damageInstance.health[1] = damageInstance.base[1] * lastResist[1];
    damageInstance.health[2] = damageInstance.base[2] * lastResist[2];
    damageInstance.health[3] = damageInstance.base[3] * lastResist[3];
    damageInstance.health[4] = damageInstance.base[4] * lastResist[4];
    damageInstance.health[5] = damageInstance.base[5] * lastResist[5];
    damageInstance.health[6] = damageInstance.base[6] * lastResist[6];
    damageInstance.health[7] = damageInstance.base[7] * lastResist[7];
    damageInstance.health[8] = damageInstance.base[8] * lastResist[8];
    damageInstance.health[9] = damageInstance.base[9] * lastResist[9];
    damageInstance.health[10] = damageInstance.base[10] * lastResist[10];
    damageInstance.health[11] = damageInstance.base[11] * lastResist[11];
    damageInstance.health[12] = damageInstance.base[12] * lastResist[12];
  }
  if (simTarget.shieldIndex !== -1) {
    damageInstance.shield[0] = damageInstance.base[0] * (1 + damageResistances.Impact[simTarget.shieldIndex]);
    damageInstance.shield[1] = damageInstance.base[1] * (1 + damageResistances.Puncture[simTarget.shieldIndex]);
    damageInstance.shield[2] = damageInstance.base[2] * (1 + damageResistances.Slash[simTarget.shieldIndex]);
    damageInstance.shield[3] = damageInstance.base[3] * (1 + damageResistances.Cold[simTarget.shieldIndex]);
    damageInstance.shield[4] = damageInstance.base[4] * (1 + damageResistances.Electricity[simTarget.shieldIndex]);
    damageInstance.shield[5] = damageInstance.base[5] * (1 + damageResistances.Heat[simTarget.shieldIndex]);
    damageInstance.shield[6] = damageInstance.base[6] * (1 + damageResistances.Toxin[simTarget.shieldIndex]);
    damageInstance.shield[7] = damageInstance.base[7] * (1 + damageResistances.Blast[simTarget.shieldIndex]);
    damageInstance.shield[8] = damageInstance.base[8] * (1 + damageResistances.Corrosive[simTarget.shieldIndex]);
    damageInstance.shield[9] = damageInstance.base[9] * (1 + damageResistances.Gas[simTarget.shieldIndex]);
    damageInstance.shield[10] = damageInstance.base[10] * (1 + damageResistances.Magnetic[simTarget.shieldIndex]);
    damageInstance.shield[11] = damageInstance.base[11] * (1 + damageResistances.Radiation[simTarget.shieldIndex]);
    damageInstance.shield[12] = damageInstance.base[12] * (1 + damageResistances.Viral[simTarget.shieldIndex]);
  }

  for (var i = 0; i < 13; i++) {
    damageInstance.baseTotal += damageInstance.base[i];
    damageInstance.healthTotal += damageInstance.health[i];
    damageInstance.shieldTotal += damageInstance.shield[i];
  }

  return damageInstance;
}