Pokémon API

Deze API biedt eindpunten voor het beheren van verschillende bronnen met betrekking tot Pokémon, waaronder gebruikers, bewegingen, typen en vermeldingen in de Pokédex.
Inhoudsopgave

    Authenticatie
    Gebruikers
    Bewegingen
    Typen
    Pokédex Vermeldingen

Authenticatie

Om toegang te krijgen tot bepaalde eindpunten is authenticatie vereist. Authenticatie wordt geïmplementeerd met behulp van JSON Web Tokens (JWT). Gebruikers kunnen een JWT-token verkrijgen door een account te registreren en in te loggen.
Routes

    POST /api/user/register - Registreer een nieuwe gebruiker.
    POST /api/user/login - Log in met bestaande referenties om een JWT-token te verkrijgen.

Gebruikers

Eindpunten met betrekking tot gebruikersbeheer.
Routes

    GET /api/user - Informatie over de huidige gebruiker ophalen.
    PATCH /api/user/:id - Gebruikersinformatie bijwerken.
    DELETE /api/user/:id - Gebruikersaccount verwijderen.

Bewegingen

Eindpunten voor het beheren van Pokémon-bewegingen.
Routes

    POST /api/moves - Maak een nieuwe beweging.
    GET /api/moves - Alle bewegingen ophalen.
    GET /api/moves/:id - Een beweging opvragen op basis van ID.
    PATCH /api/moves/:id - Een beweging gedeeltelijk bijwerken op basis van ID.
    PUT /api/moves/:id - Een beweging volledig bijwerken op basis van ID.
    DELETE /api/moves/:id - Een beweging verwijderen op basis van ID.

Typen

Eindpunten voor het beheren van Pokémon-typen.
Routes

    POST /api/types - Maak een nieuw type aan.
    GET /api/types - Alle typen ophalen.
    GET /api/types/:id - Een type opvragen op basis van ID.
    PATCH /api/types/:id - Een type gedeeltelijk bijwerken op basis van ID.
    PUT /api/types/:id - Een type volledig bijwerken op basis van ID.
    DELETE /api/types/:id - Een type verwijderen op basis van ID.

Pokédex Vermeldingen

Eindpunten voor het beheren van vermeldingen in de Pokédex.
Routes

    POST /api/pokedex - Maak een nieuwe vermelding in de Pokédex.
    GET /api/pokedex - Alle vermeldingen uit de Pokédex ophalen.
    GET /api/pokedex/:id - Een specifieke vermelding uit de Pokédex opvragen op basis van ID.
    PATCH /api/pokedex/:id - Een specifieke vermelding in de Pokédex gedeeltelijk bijwerken op basis van ID.
    PUT /api/pokedex/:id - Een specifieke vermelding in de Pokédex volledig bijwerken op basis van ID.
    DELETE /api/pokedex/:id - Een specifieke vermelding uit de Pokédex verwijderen op basis van ID.
