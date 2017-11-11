using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Elements;

namespace Inventory.ItemTypes
{
    public class SkinItem : BaseItem
    {
        public PedHash Hash { get; set; }

        public SkinItem(string name, string description, int stackSize, PedHash hash) : base(name, description, stackSize)
        {
            Hash = hash;
        }

        public override bool Use(Client player)
        {
            if ((PedHash)player.model == Hash)
            {
                player.sendChatMessage($"Your skin is already {Hash}.");
                return false;
            }

            player.sendChatMessage($"Changed skin to {Hash}.");
            player.setSkin(Hash);
            return true;
        }
    }
}
