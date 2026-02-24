

Veb aplikacija za evidenciju rasporeda nastave studenata, upravljanje neradnim danima i akademskim kalendarom.

## Opis aplikacije
Aplikacija omogućava studentima uvid u njihov nedeljni raspored nastave i akademski kalendar (praznici, kolokvijumske nedelje, ispitni rokovi). Administratori imaju mogućnost upravljanja grupama i definisanja neradnih dana direktno preko interaktivnog kalendara.

## Tehnologije
- **Frontend/Backend**: Next.js 16 (App Router)
- **Baza podataka**: PostgreSQL
- **ORM**: Drizzle ORM
- **Stilovi**: Tailwind CSS
- **Ikone**: Lucide React
- **Kontejnerizacija**: Docker & Docker Compose

## Instrukcije za lokalno pokretanje

1.  **Instalacija zavisnosti**:
    ```bash
    npm install
    ```
2.  **Konfiguracija okruženja**:
    Kreirajte `.env` fajl na osnovu `.env.template` i popunite potrebne varijable (DATABASE_URL, JWT_SECRET, itd.).
3.  **Podešavanje baze**:
    ```bash
    npm run db:setup
    ```
4.  **Pokretanje razvojnog servera**:
    ```bash
    npm run dev
    ```
    Stranica će biti dostupna na http://localhost:3000 (ili portu koji ste definisali u `.env`).

## Pokretanje pomoću Docker-a

Aplikacija je u potpunosti podržana za rad u kontejnerima.

1.  **Pokretanje servisa**:
    ```bash
    docker-compose up -d --build
    ```
    Ova komanda će podići:
    - `iteh_nextjs`: Next.js aplikaciju
    - `iteh_postgres`: PostgreSQL bazu podataka
    - `iteh_pgadmin`: Interfejs za upravljanje bazom podataka (dostupan na portu 5050)

2.  **Pristup aplikaciji**:
    Aplikacija će po defaultu biti dostupna na [http://localhost:3001](http://localhost:3001).

---

### Autori:
- Lazar Nikolić 2022/0120
- Nemanja Orelj 2022/0127
- Marko Mitić 2020/0059