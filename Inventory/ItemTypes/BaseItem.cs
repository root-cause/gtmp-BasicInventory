using GrandTheftMultiplayer.Server.Elements;

namespace Inventory.ItemTypes
{
    public class BaseItem
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int StackSize { get; set; }

        public BaseItem(string name, string description, int stackSize)
        {
            Name = name;
            Description = description;
            StackSize = stackSize;
        }

        public virtual bool Use(Client player)
        {
            return true;
        }
    }
}
