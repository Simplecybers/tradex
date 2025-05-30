PGDMP         ,    
            }           tradexcapital    14.5    14.5 D    T           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            V           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            W           1262    41209    tradexcapital    DATABASE     q   CREATE DATABASE tradexcapital WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.utf8';
    DROP DATABASE tradexcapital;
                postgres    false            �            1259    41211    contents    TABLE     U  CREATE TABLE public.contents (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    type text NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.contents;
       public         heap    postgres    false            �            1259    41210    contents_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.contents_id_seq;
       public          postgres    false    210            X           0    0    contents_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.contents_id_seq OWNED BY public.contents.id;
          public          postgres    false    209            �            1259    41225    kyc    TABLE     ~  CREATE TABLE public.kyc (
    id integer NOT NULL,
    user_id integer NOT NULL,
    document_type text NOT NULL,
    document_id text NOT NULL,
    document_path text,
    status text DEFAULT 'pending'::text NOT NULL,
    rejection_reason text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.kyc;
       public         heap    postgres    false            �            1259    41224 
   kyc_id_seq    SEQUENCE     �   CREATE SEQUENCE public.kyc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 !   DROP SEQUENCE public.kyc_id_seq;
       public          postgres    false    212            Y           0    0 
   kyc_id_seq    SEQUENCE OWNED BY     9   ALTER SEQUENCE public.kyc_id_seq OWNED BY public.kyc.id;
          public          postgres    false    211            �            1259    41237 	   portfolio    TABLE     Z  CREATE TABLE public.portfolio (
    id integer NOT NULL,
    user_id integer NOT NULL,
    asset_symbol text NOT NULL,
    asset_type text NOT NULL,
    quantity real NOT NULL,
    average_price real NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.portfolio;
       public         heap    postgres    false            �            1259    41236    portfolio_id_seq    SEQUENCE     �   CREATE SEQUENCE public.portfolio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.portfolio_id_seq;
       public          postgres    false    214            Z           0    0    portfolio_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.portfolio_id_seq OWNED BY public.portfolio.id;
          public          postgres    false    213            �            1259    41248    settings    TABLE     �   CREATE TABLE public.settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.settings;
       public         heap    postgres    false            �            1259    41247    settings_id_seq    SEQUENCE     �   CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.settings_id_seq;
       public          postgres    false    216            [           0    0    settings_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;
          public          postgres    false    215            �            1259    41260    transactions    TABLE     �  CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    amount real NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    asset_symbol text,
    asset_type text,
    leverage real,
    duration integer DEFAULT 1 NOT NULL,
    take_profit real,
    stop_loss real,
    margin real,
    order_type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.transactions;
       public         heap    postgres    false            �            1259    41259    transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transactions_id_seq;
       public          postgres    false    218            \           0    0    transactions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
          public          postgres    false    217            �            1259    41273    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name text,
    last_name text,
    is_verified boolean DEFAULT false NOT NULL,
    is_email_verified boolean DEFAULT false NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    verification_token text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    41272    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    220            ]           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    219            �            1259    41290    wallets    TABLE     �   CREATE TABLE public.wallets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    balance real DEFAULT 0 NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.wallets;
       public         heap    postgres    false            �            1259    41289    wallets_id_seq    SEQUENCE     �   CREATE SEQUENCE public.wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.wallets_id_seq;
       public          postgres    false    222            ^           0    0    wallets_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.wallets_id_seq OWNED BY public.wallets.id;
          public          postgres    false    221            �            1259    41302 	   watchlist    TABLE       CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    asset_symbol text NOT NULL,
    asset_name text NOT NULL,
    asset_type text NOT NULL,
    exchange text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.watchlist;
       public         heap    postgres    false            �            1259    41301    watchlist_id_seq    SEQUENCE     �   CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.watchlist_id_seq;
       public          postgres    false    224            _           0    0    watchlist_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;
          public          postgres    false    223                       2604    41214    contents id    DEFAULT     j   ALTER TABLE ONLY public.contents ALTER COLUMN id SET DEFAULT nextval('public.contents_id_seq'::regclass);
 :   ALTER TABLE public.contents ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            �           2604    41228    kyc id    DEFAULT     `   ALTER TABLE ONLY public.kyc ALTER COLUMN id SET DEFAULT nextval('public.kyc_id_seq'::regclass);
 5   ALTER TABLE public.kyc ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    212    212            �           2604    41240    portfolio id    DEFAULT     l   ALTER TABLE ONLY public.portfolio ALTER COLUMN id SET DEFAULT nextval('public.portfolio_id_seq'::regclass);
 ;   ALTER TABLE public.portfolio ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    214    214            �           2604    41251    settings id    DEFAULT     j   ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);
 :   ALTER TABLE public.settings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    41263    transactions id    DEFAULT     r   ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);
 >   ALTER TABLE public.transactions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    41276    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    41293 
   wallets id    DEFAULT     h   ALTER TABLE ONLY public.wallets ALTER COLUMN id SET DEFAULT nextval('public.wallets_id_seq'::regclass);
 9   ALTER TABLE public.wallets ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    41305    watchlist id    DEFAULT     l   ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);
 ;   ALTER TABLE public.watchlist ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            C          0    41211    contents 
   TABLE DATA           h   COPY public.contents (id, title, slug, content, type, is_published, created_at, updated_at) FROM stdin;
    public          postgres    false    210   cQ       E          0    41225    kyc 
   TABLE DATA           �   COPY public.kyc (id, user_id, document_type, document_id, document_path, status, rejection_reason, created_at, updated_at) FROM stdin;
    public          postgres    false    212   �Q       G          0    41237 	   portfolio 
   TABLE DATA           {   COPY public.portfolio (id, user_id, asset_symbol, asset_type, quantity, average_price, created_at, updated_at) FROM stdin;
    public          postgres    false    214   �Q       I          0    41248    settings 
   TABLE DATA           D   COPY public.settings (id, key, value, type, updated_at) FROM stdin;
    public          postgres    false    216   �Q       K          0    41260    transactions 
   TABLE DATA           �   COPY public.transactions (id, user_id, type, amount, currency, status, asset_symbol, asset_type, leverage, duration, take_profit, stop_loss, margin, order_type, created_at) FROM stdin;
    public          postgres    false    218   �Q       M          0    41273    users 
   TABLE DATA           �   COPY public.users (id, username, email, password, first_name, last_name, is_verified, is_email_verified, is_admin, verification_token, created_at) FROM stdin;
    public          postgres    false    220   �Q       O          0    41290    wallets 
   TABLE DATA           M   COPY public.wallets (id, user_id, balance, currency, created_at) FROM stdin;
    public          postgres    false    222   R       Q          0    41302 	   watchlist 
   TABLE DATA           l   COPY public.watchlist (id, user_id, asset_symbol, asset_name, asset_type, exchange, created_at) FROM stdin;
    public          postgres    false    224   .R       `           0    0    contents_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.contents_id_seq', 1, false);
          public          postgres    false    209            a           0    0 
   kyc_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.kyc_id_seq', 1, false);
          public          postgres    false    211            b           0    0    portfolio_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.portfolio_id_seq', 1, false);
          public          postgres    false    213            c           0    0    settings_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.settings_id_seq', 1, false);
          public          postgres    false    215            d           0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);
          public          postgres    false    217            e           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    219            f           0    0    wallets_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.wallets_id_seq', 1, false);
          public          postgres    false    221            g           0    0    watchlist_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.watchlist_id_seq', 1, false);
          public          postgres    false    223            �           2606    41221    contents contents_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.contents DROP CONSTRAINT contents_pkey;
       public            postgres    false    210            �           2606    41223    contents contents_slug_unique 
   CONSTRAINT     X   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_slug_unique UNIQUE (slug);
 G   ALTER TABLE ONLY public.contents DROP CONSTRAINT contents_slug_unique;
       public            postgres    false    210            �           2606    41235    kyc kyc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.kyc DROP CONSTRAINT kyc_pkey;
       public            postgres    false    212            �           2606    41246    portfolio portfolio_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.portfolio DROP CONSTRAINT portfolio_pkey;
       public            postgres    false    214            �           2606    41258    settings settings_key_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);
 F   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_key_unique;
       public            postgres    false    216            �           2606    41256    settings settings_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_pkey;
       public            postgres    false    216            �           2606    41271    transactions transactions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public            postgres    false    218            �           2606    41344    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public            postgres    false    220            �           2606    41284    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    220            �           2606    41300    wallets wallets_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.wallets DROP CONSTRAINT wallets_pkey;
       public            postgres    false    222            �           2606    41310    watchlist watchlist_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.watchlist DROP CONSTRAINT watchlist_pkey;
       public            postgres    false    224            �           2606    41311    kyc kyc_user_id_users_id_fk    FK CONSTRAINT     z   ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 E   ALTER TABLE ONLY public.kyc DROP CONSTRAINT kyc_user_id_users_id_fk;
       public          postgres    false    212    3245    220            �           2606    41316 '   portfolio portfolio_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 Q   ALTER TABLE ONLY public.portfolio DROP CONSTRAINT portfolio_user_id_users_id_fk;
       public          postgres    false    214    3245    220            �           2606    41321 -   transactions transactions_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 W   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_user_id_users_id_fk;
       public          postgres    false    220    218    3245            �           2606    41326 #   wallets wallets_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 M   ALTER TABLE ONLY public.wallets DROP CONSTRAINT wallets_user_id_users_id_fk;
       public          postgres    false    222    220    3245            �           2606    41331 '   watchlist watchlist_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 Q   ALTER TABLE ONLY public.watchlist DROP CONSTRAINT watchlist_user_id_users_id_fk;
       public          postgres    false    220    3245    224            C      x������ � �      E      x������ � �      G      x������ � �      I      x������ � �      K      x������ � �      M      x������ � �      O      x������ � �      Q      x������ � �     