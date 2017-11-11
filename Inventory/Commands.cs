using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Managers;
using Inventory.Classes;
using Inventory.Extensions;

namespace Inventory
{
    public class Commands : Script
    {
        [Command("additem")]
        public void CMD_AddItem(Client player, ItemID item, int amount)
        {
            player.giveItem(item, amount);
        }

        [Command("clearitems")]
        public void CMD_ClearItems(Client player)
        {
            player.clearInventory();
        }
    }
}
