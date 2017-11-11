var inventoryMenu = null;
var itemActionsMenu = null;
var inventoryData = [];
var selectedIdx = -1;
var dropAmount = 0;

API.onResourceStart.connect(function() {
    // main inventory menu
    inventoryMenu = API.createMenu("Inventory", "Select an item.", 0, 0, 6);
    inventoryMenu.OnItemSelect.connect(function(menu, item, index) {
        selectedIdx = index;

        // update actions menu
        API.setMenuTitle(itemActionsMenu, inventoryData[index].Name);

        itemActionsMenu.Clear();
        itemActionsMenu.AddItem(API.createMenuItem("Use", ""));

        if (inventoryData[index].IsDroppable) {
            if (inventoryData[index].Quantity > 1) {
                var amountList = new List(String);
                for (var i = 1; i <= inventoryData[index].Quantity; i++) amountList.Add(i.toString());

                itemActionsMenu.AddItem(API.createListItem("Drop", "", amountList, 0));
            } else {
                itemActionsMenu.AddItem(API.createMenuItem("Drop", ""));
            }
        } else {
            itemActionsMenu.AddItem(API.createMenuItem("Drop", "You can't drop this item."));
            itemActionsMenu.MenuItems[1].Enabled = false;
        }

        dropAmount = 0;
        inventoryMenu.Visible = false;
        itemActionsMenu.Visible = true;
    });

    // actions menu
    itemActionsMenu = API.createMenu("ItemName", "Select an action.", 0, 0, 6);
    itemActionsMenu.ParentMenu = inventoryMenu;

    itemActionsMenu.OnItemSelect.connect(function(menu, item, index) {
        switch (index)
        {
            case 0:
                API.triggerServerEvent("ConsumeItem", selectedIdx);
            break;

            case 1:
                if (!inventoryData[selectedIdx].IsDroppable) return;
                var amount = (inventoryData[selectedIdx].Quantity > 1) ? dropAmount : 1;
                if (amount < 1) amount = 1;

                var pos = API.getEntityFrontPosition(API.getLocalPlayer());
                var ground = API.getGroundHeight(pos);
                API.triggerServerEvent("DropItem", selectedIdx, amount, new Vector3(pos.X, pos.Y, ground));
            break;
        }
    });

    itemActionsMenu.OnListChange.connect(function(menu, item, newIndex) {
        dropAmount = newIndex + 1;
    });
});

API.onServerEventTrigger.connect(function(eventName, args) {
    switch (eventName)
    {
        case "ReceiveInventory":
            inventoryMenu.Clear();

            // load data
            inventoryData = JSON.parse(args[0]);
            for (var i = 0; i < inventoryData.length; i++)
            {
                var temp_item = API.createMenuItem(inventoryData[i].Name, inventoryData[i].Description);
                if (inventoryData[i].StackSize > 1) temp_item.SetRightLabel(inventoryData[i].Quantity + "/" + inventoryData[i].StackSize);

                inventoryMenu.AddItem(temp_item);
            }

            selectedIdx = -1;
            itemActionsMenu.Visible = false;
            inventoryMenu.Visible = (inventoryData.length > 0);

            if (inventoryData.length < 1)
            {
                API.callNative("_SET_NOTIFICATION_BACKGROUND_COLOR", 11);
                API.sendNotification("Your inventory is empty.");
            }
        break;

        case "CloseInventoryMenus":
            inventoryMenu.Visible = false;
            itemActionsMenu.Visible = false;
        break;
    }
});

API.onKeyUp.connect(function(e, key) {
    if (key.KeyCode == Keys.I)
    {
        if (API.isChatOpen() || API.isAnyMenuOpen()) return;
        API.triggerServerEvent("RequestInventory");
    }
});