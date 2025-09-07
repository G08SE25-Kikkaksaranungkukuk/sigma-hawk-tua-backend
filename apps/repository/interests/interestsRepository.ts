export class InterestsRepository {
    async getAllInterests() {
        // This would be a DB query if interests were a table
        // For now, return static list
        return [
            { id: "SEA", label: "🌊 Sea", color: "blue" },
            { id: "MOUNTAIN", label: "⛰️ Mountain", color: "green" },
            { id: "WATERFALL", label: "💧 Waterfall", color: "sky" },
            { id: "NATIONAL_PARK", label: "🏞️ National Park", color: "teal" },
            { id: "ISLAND", label: "🏝️ Island", color: "cyan" },
            { id: "TEMPLE", label: "🙏 Temple", color: "indigo" },
            { id: "SHOPPING_MALL", label: "🛍️ Shopping Mall", color: "violet" },
            { id: "MARKET", label: "🏪 Market", color: "orange" },
            { id: "CAFE", label: "☕ Cafe", color: "amber" },
            { id: "HISTORICAL", label: "🏛️ Historical", color: "yellow" },
            { id: "AMUSEMENT_PARK", label: "🎢 Amusement Park", color: "pink" },
            { id: "ZOO", label: "🦁 Zoo", color: "emerald" },
            { id: "FESTIVAL", label: "🎉 Festival", color: "red" },
            { id: "MUSEUM", label: "🏛️ Museum", color: "purple" },
            { id: "FOOD_STREET", label: "🍴 Food Street", color: "rose" },
            { id: "BEACH_BAR", label: "🍹 Beach Bar", color: "cyan" },
            { id: "THEATRE", label: "🎭 Theatre", color: "slate" },
        ];
    }
}
