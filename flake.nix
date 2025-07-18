{
  description = "A reproducible development environment with Node.js and PostgreSQL";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      # FIX 2: Use an explicit version that supports the syntax we need.
      packages = with pkgs; [
        nodejs_20
        postgresql_15
      ];

      shellHook = ''
        echo "--- Nix shellHook starting ---"

        export PGDATA="$PWD/postgres_data"
        export PGHOST=$PGDATA
        export PGDATABASE=postgres

        mkdir -p $PGDATA

        # --- FIX 1: The Correct Initialization Logic ---
        # This block only runs ONCE. It performs a self-contained setup.
        if [ ! -f "$PGDATA/PG_VERSION" ]; then
          echo "PostgreSQL data directory is not initialized. Running full setup..."
          
          # 1. Create the database cluster.
          initdb -D $PGDATA --no-locale --encoding=UTF8

          # 2. Start a TEMPORARY server for setup.
          echo "Temporarily starting server for user creation..."
          pg_ctl -D $PGDATA -l "$PGDATA/logfile" -w -o "-c unix_socket_directories=$PGDATA" start

          # 3. Create the user. 'CREATE ROLE' is the modern equivalent of 'CREATE USER'.
          echo "Creating 'postgres' user..."
          psql -c "CREATE USER postgres; ALTER ROLE postgres WITH SUPERUSER;"

          # 4. Stop the TEMPORARY server. Setup is now complete.
          echo "Stopping temporary server..."
          pg_ctl -D $PGDATA -w stop

          echo "Database initialized with 'postgres' user."
        fi

        # Robustness: Clean up stale lock files.
        rm -f "$PGDATA/postmaster.pid"

        # This command now runs EVERY time you enter the shell, ensuring the server is always running.
        echo "Starting PostgreSQL server for your session..."
        pg_ctl -D $PGDATA -l "$PGDATA/logfile" -w -o "-c unix_socket_directories=$PGDATA" start

        npm i

        # The trap ensures the server is stopped cleanly on shell exit.
        trap 'echo "Stopping PostgreSQL server..."; pg_ctl -D $PGDATA stop' EXIT

        echo ""
        echo "✅ PostgreSQL is running and ready for connections."
        echo "   - Connect using:  psql"
        echo ""
        echo "--- Nix shellHook finished ---"
      '';
    };
  };
}
