import { Address, UTxO, SpendingValidator } from 'lucid-cardano'
import type { Move } from 'types/games/rps/types'

export const validatorAddress: Address = "addr_test1wphqnqwtmrg6xky2wyf0lenerpd2eunky7tccvvfjagztwqgudsy8"

export const RpsScript: SpendingValidator = {
  type: "PlutusV2",
  script: "591ede591edb0100003232323233223233223232323232333222333222323232323233223232323232323232333222323232323232332232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232322323232322323232232325335323232323232323232323232323304d3301d4912054687265616420746f6b656e206d697373696e672066726f6d20696e7075742e00330543304c301b50043034500b480094cd4c0dc034854cd4c0fc038854ccd400454cccccd4028417841788417c41784cc13ccc07d2411c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506e301c5008335506e2001303a500d3301f491124e4654206d757374206265206275726e742e005007221060105e15333333500a13304f3301f4911c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506e301c5008335506e2001303a500d3301f491124e4654206d757374206265206275726e742e005007105e2105f105e105e221060153333335009105d13304e3301e49011c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506d301b5007335506d20013039500c3304e3301e49014043616e6e6f7420636c61696d206265666f72652074696d65206475726174696f6e20676976656e20666f7220666972737420706c617965722773206d6f76652e0033350445051350433332001505848009402cc075401ccc079241124e4654206d757374206265206275726e742e0050062105e105d105d221330503302049011b4e6f74207369676e656420627920666972737420706c617965722e00335506f301d5009335506f2001303c500e3305033020490110436f6d6d6974206d69736d617463682e0033035372466e28008ccd4005220105506170657200488104526f636b0048810853636973736f727300500f33050330204901104d697373656420646561646c696e652e003335046505333502f3038500e500d301f50095333553353332001505c001003106b1533553335001153335003105f1060105f153335003105f105f10601533350031060105f105f106a10691330503302049011357726f6e67206f757470757420646174756d2e00330503303530425005500f330503332001505b303a50053507500333320015059500406b330503302049011a546f6b656e206d697373696e672066726f6d206f75747075742e00330573304f301e50063037500e48008cc08124012d5365636f6e6420706c617965722773207374616b65206d697373696e6720696e2064726177206f75747075742e00330573505d301e50063039500e1330204901124e4654206d757374206265206275726e742e005008133050330204911357726f6e67206f757470757420646174756d2e00330503303530425005500f330503332001505b303a500535075003333200150595004069330503302049011a546f6b656e206d697373696e672066726f6d206f75747075742e00330573304f301e50063037500e48008cc081240126596f75206c6f73742c2063616e6e6f742074616b65207374616b652066726f6d2067616d652e00330573505d301e50063332001505848010c0e5403854cd4c0f80348417454cccccd40204170417084cc138cc0792411c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506d301b5007335506d20013039500c3304e3301e490120466972737420706c617965722773207374616b65206973206d697373696e672e00330553505b301c50053037500c3304e3301e4901215365636f6e6420706c617965722773207374616b65206973206d697373696e672e00330553505b301c50043332001505648010c0dd4030cc138cc07924011357726f6e67206f757470757420646174756d2e003304e3303330405003500d3332001505930385003350730013304e3301e491104d697373656420646561646c696e652e003335044505133502d3036500c500a301d50073301e49011a546f6b656e206d697373696e672066726f6d206f75747075742e00330553304d301c50043035500c480084cc134cc07524011b4e6f74207369676e656420627920666972737420706c617965722e00335506c301a5006335506c20013039500b3304d3301d49014143616e6e6f7420636c61696d206265666f72652074696d65206475726174696f6e20676976656e20666f72207365636f6e6420706c617965722773206d6f76652e00333504350503504233320015057480094024c0714018cc075241124e4654206d757374206265206275726e742e005005105c22105e15335303d5001210011350724901334d6174636820726573756c7420657870656374656420627574206f757470757420646174756d20686173206e6f7468696e672e001335506a05d306b50011533533550693355302a1200122533532323304e33033303a002303a0013304e33033303900230390013304e33055303700230370013304e33055303600230360013304e33055303e002303e0013304e3232350022235003225335333573466e3c01000819018c4cc0e400c004418cc0d8008c0d4008cc138cc0c8c0d0008c0d0004cc138cc0ccc0ec008c0ec004cc138cc154c0f0008c0f0004cc138cc0ccc104008c104004cc0ccc108008c108004c0f0034c0eccd541ac178c1b00084cd41b4008004400541b14cd4c0ac01084d400488d40048888d402c88d4008888888888888ccd54c0fc4800488d400888894cd4d406088d401888c8cd40148cd401094cd4ccd5cd19b8f00200107c07b15003107b207b2335004207b25335333573466e3c0080041f01ec5400c41ec54cd400c854cd400884cd40088cd40088cd40088cd40088cc15000800481f88cd400881f88cc1500080048881f8888cd401081f88894cd4ccd5cd19b87006003081010800115335333573466e1c01400820404200044cc1e001000442000442000441e454cd4004841e441e44cd42180401801440154204040284c98c81c8cd5ce2481024c6600072135070491384e6f206f7574707574206174207468697320736372697074206164647265737320686176696e672073616d6520706172616d65746572732e00221533500110022213507449012145787065637465642065786163746c79206f6e652067616d65206f75747075742e0015335302a00321350012200113506f49011347616d6520696e707574206d697373696e672e0013304f3304732350012222222222220085001302f5006480044d400488008cccd5cd19b8735573aa0109000119910919800801801191919191919191919191919191999ab9a3370e6aae754031200023333333333332222222222221233333333333300100d00c00b00a00900800700600500400300233502602735742a01866a04c04e6ae85402ccd40980a0d5d0a805199aa8153ae502935742a012666aa054eb940a4d5d0a80419a8130179aba150073335502a03075a6ae854018c8c8c8cccd5cd19b8735573aa0049000119a8281919191999ab9a3370e6aae7540092000233505533503a75a6ae854008c0ecd5d09aba25002232632085013357380be10a021060226aae7940044dd50009aba150023232323333573466e1cd55cea80124000466a0ae66a074eb4d5d0a801181d9aba135744a004464c6410a0266ae7017c2140420c044d55cf280089baa001357426ae8940088c98c820404cd5ce02d8408083f89aab9e5001137540026ae854014cd4099d71aba150043335502a02c200135742a006666aa054eb88004d5d0a80118171aba135744a004464c640fa66ae7015c1f41ec4d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a804180f1aba135744a010464c640de66ae701241bc1b4cccd5cd19b87500948028848888880188cccd5cd19b87500a48020848888880088cccd5cd19b87500b48018848888880148cccd5cd19b87500c480108488888800c8cccd5cd19b87500d480088c8c84888888cc00402001cc130d5d09aba25010375c6ae85403c8cccd5cd19b87500e480008c84888888c01001cc130d5d09aab9e501123263207333573809a0e60e20e00de0dc0da0d826664002a09c6058a004640026068a00426664002a09a6664002a09a6056a002640026066a002640026066a00226062004260660026666ae68cdc39aab9d500b480008cccc154c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa01690001199999999998309bae35742a0166eb8d5d0a8051bad35742a0126eb4d5d0a8041bad35742a00e6464646666ae68cdc39aab9d5002480008cd541d4dd71aba15002375c6ae84d5d1280111931903d19ab9c05407a078135573ca00226ea8004d5d0a80318131aba15005375c6ae854010dd69aba15003375c6ae854008dd71aba135744a004464c640ec66ae701401d81d04d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae85402cdd71aba1500a33501704235742a01266a02e4646666ae68cdc3a800a400840be46666ae68cdc3a8012400440bc46666ae68cdc3a801a400040c0464c640dc66ae701201b81b01ac1a84d55ce9baa001357426ae8940248c98c81a4cd5ce021834833883409a8332490350543500135573ca00226ea80044d55cea80109aab9e50011375400226ae8940044d5d1280089aab9e500113754002446a004444444444444a66a666aa604824002a0464a66a666ae68cdc780700082902889a8338008a83300210829082811a800911100191a80091111111111100291299a8008821099ab9c0020411232230023758002640026aa0b2446666aae7c004941548cd4150c010d5d080118019aba200205a232323333573466e1cd55cea8012400046644246600200600460146ae854008c014d5d09aba2500223263205a3357380680b40b026aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea8012400046644246600200600460266ae854008cd4034048d5d09aba2500223263205f3357380720be0ba26aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931903099ab9c03b06105f05e05d135573aa00226ea8004d5d0a80119a804bae357426ae8940088c98c816ccd5ce01a82d82c89aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5415888c8cccd55cf80112829919a82919aa82a18031aab9d5002300535573ca00460086ae8800c1604d5d080089119191999ab9a3370ea002900011a82a18029aba135573ca00646666ae68cdc3a801240044a0a8464c640b066ae700c81601581544d55cea80089baa001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c640b066ae700c816015815415014c4d55cea80089baa001232323333573466e1cd55cea80124000466082600a6ae854008dd69aba135744a004464c640a866ae700b81501484d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e50022326320523357380580a40a026ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263205b33573806a0b60b20b00ae0ac0aa0a80a626aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931902a19ab9c02e054052051135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c8144cd5ce01582882782709aab9d50011375400224464646666ae68cdc3a800a40084a04846666ae68cdc3a8012400446a04c600c6ae84d55cf280211999ab9a3370ea00690001091100111931902919ab9c02c05205004f04e135573aa00226ea80048c8cccd5cd19b8750014800880d48cccd5cd19b8750024800080d48c98c8138cd5ce01402702602589aab9d375400224466a03466a0366a04000406666a03a6a040002066640026aa0924422444a66a00220044426600a004666aa600e2400200a00800246a002446a0044444444444446666a01a4a0a64a0a64a0a64666aa602424002a02246a00244a66a6602c00400826a0ae0062a0ac01a264246600244a66a004420062002004a084640026aa08c4422444a66a00226a00644002442666a00a440046008004666aa600e2400200a00800244a66a666ae68cdc79a801110011a800910010170168999ab9a3370e6a004440026a0024400205c05a205a44666ae68cdc780100081681611a8009111111111100291a8009111111111100311a8009111111111100411a8009111111111100491a800911100111a8009111111111100511a8009111111111100591a8009111111111100211a8009111111111100191a800911100211a8009111111111100391a800911100091a800911100191a8009111111111100111a800911111111110008919a80199a8021a80480080e19a803280400e09111a801111a801111a802911a801112999a999a8080058030010a99a8008a99a8028999a80700580180388120999a80700580180388120999a8070058018038910919800801801091091980080180109111a801111a801912999a999a8048038020010a99a8018800880f080e880f09109198008018010911191919192999a80310a999a80310a999a80410980224c26006930a999a80390980224c2600693080a08090a999a80390980224c26006930a999a80310980224c260069308098a999a80290808880908080a999a80290a999a803909802a4c26008930a999a803109802a4c2600893080988088a999a803109802a4c26008930a999a802909802a4c2600893080912999a80290a999a80390a999a80390999a8068050010008b0b0b08090a999a80310a999a80310999a8060048010008b0b0b0808880812999a80210a999a80310a999a80310999a8060048010008b0b0b08088a999a80290a999a80290999a8058040010008b0b0b0808080792999a80190a999a80290a999a80290999a8058040010008b0b0b08080a999a80210a999a80210999a8050038010008b0b0b0807880712999a80110a999a80210a999a80210999a8050038010008b0b0b08078a999a80190a999a80190999a8048030010008b0b0b08070806890911180180208911000891a80091111111003911a8009119980980200100091299a801080088089191999ab9a3370ea0029002100c11999ab9a3370ea0049001100d91999ab9a3370ea0069000100d91931901619ab9c00602c02a029028135573a6ea8005241035054310011233333333001005225335333573466e1c00800404003c401854cd4ccd5cd19b8900200101000f1004100522333573466e2000800404003c88ccd5cd19b8900200101000f22333573466e2400800403c04088ccd5cd19b8800200100f010225335333573466e2400800404003c40044008894cd4ccd5cd19b8900200101000f1002100112220031222002122200122333573466e1c00800402c028488cdc10010008912999a8010a999a8008804880408040a999a8008804080488040a999a80088040804080489119b8000200113222533500221533500221330050020011008153350012100810085001122533350021533350011006100510051533350011005100610051533350011005100510061232001333002001005005222323230010053200135501f223350014800088d4008894cd4ccd5cd19b8f00200900c00b13007001130060033200135501e223350014800088d4008894cd4ccd5cd19b8f00200700b00a1001130060031220021220014890025335335500e232323232323333333574800c46666ae68cdc39aab9d5006480008cccd55cfa8031280e11999aab9f50062501d233335573ea00c4a03c46666aae7d40189407c8cccd55cf9aba2500725335533553355335323232323232323232323232323333333574801a46666ae68cdc39aab9d500d480008cccd55cfa8069281811999aab9f500d25031233335573ea01a4a06446666aae7d4034940cc8cccd55cfa8069281a11999aab9f500d25035233335573ea01a4a06c46666aae7d4034940dc8cccd55cfa8069281c11999aab9f500d25039233335573ea01a4a07446666aae7cd5d128071299aa99aa99aa99aa99aa99aa99aa99aa99aa99aa99a98199aba15019213503d302b0011503b215335303435742a032426a07c60040022a0782a07642a66a606a6ae85406084d40f8c008004540f0540ec854cd4c0d4d5d0a80b909a81f18010008a81e0a81d90a99a981a9aba15016213503e30020011503c1503b215335323232323333333574800846666ae68cdc39aab9d5004480008cccd55cfa8021282191999aab9f500425044233335573e6ae89401494cd4c0f4d5d0a80390a99a981f1aba15007213504833550460020011504615045250450480470462504204425041250412504125041044135744a00226aae7940044dd50009aba15015213503e30020011503c1503b215335323232323333333574800846666ae68cdc39aab9d5004480008cccd55cfa8021282191999aab9f500425044233335573e6ae89401494cd4c8c8c8ccccccd5d200191999ab9a3370e6aae75400d2000233335573ea0064a09646666aae7cd5d128021299a98221aba15005213504e0011504c2504c04f04e2504a04c2504925049250492504904c135573ca00226ea8004d5d0a80390a99a981f9aba150072135048330380020011504615045250450480470462504204425041250412504125041044135744a00226aae7940044dd50009aba15014213503e30020011503c1503b215335303435742a026426a07c60040022a0782a07642a66a606a6ae85404884d40f8c008004540f0540ec854cd4c0d0d5d0a808909a81f18010008a81e0a81d90a99a981a1aba15010213503e30020011503c1503b2503b03e03d03c03b03a0390380370360350340332502f0312502e2502e2502e2502e031135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a016426a04460220022a04042a66a60326ae85402c84d408cc0080045408454080854cd4cd406c8c8c8c8ccccccd5d200211999ab9a3370ea004900211999aab9f500423502901a2502802b23333573466e1d400d2002233335573ea00a46a05403a4a05205846666ae68cdc3a8022400046666aae7d40188d40ac074940a80b4940a40ac0a80a4940989409894098940980a44d55cea80109aab9e5001137540026ae85402884d408cc0080045408454080854cd4cd406c8c8c8c8ccccccd5d200211999ab9a3370ea004900211999aab9f500423502901f2502802b23333573466e1d400d2002233335573ea00a46a05403c4a05205846666ae68cdc3a8022400046666aae7d40188d40ac080940a80b4940a40ac0a80a4940989409894098940980a44d55cea80109aab9e5001137540026ae85402484d408cc00800454084540809408008c08808408007c9406c074940689406894068940680744d5d1280089aba25001135744a00226aae7940044dd50008009080089a80aa491e446174756d20636f756c646e277420626520646573657269616c697365640022222222222123333333333300100c00b00a00900800700600500400300222221233330010050040030022212330010030021222003122200212220011222003122200212220012333333357480024a0144a0144a0144a01446a0166eb80080348ccccccd5d200092804928049280491a8051bad0022500900c1223232323333333574800846666ae68cdc3a8012400046666aae7d4010940388cccd55cf9aba2500525335300935742a00c426a0226a0220022a01e4a01e02402246666ae68cdc3a801a400446666aae7d40148d4041403c9403c0489403804003c9403094030940309403003c4d55cea80109aab9e500113754002224460040024a666a6a002444400426a00e92011e47616d65206f757470757420646f65736e2774206861766520646174756d0021001213500849012647616d65206f757470757420646f65736e2774206861766520646174756d20696e6c696e656400112200212212233001004003112212330010030021212230020031122001123263200333573800200693090008891918008009119801980100100081"
}

export const validatorRefUtxo: UTxO = {
  txHash: "6eb21cb3766e3d0c67a8a57d1d9e05d02b14e4e23b90f2a6a0a6a87af72f25d5",
  outputIndex: 1,
  address: "addr_test1qr5zypvu3va5y3q2m8envvd08sj5mams3znp3nh8q6arx4vre0cyeg6lqagujyhvr4ylx5wlgwjs3uyl8z0spz4akxzq6wyfzk",
  assets: { lovelace: 36000000n },
  // actually this below scriptRef is nothing but "d818591ee68202591ee1" + cborHex (this prefix need not be always the same)
  scriptRef: "d818591ee68202591ee1591ede591edb0100003232323233223233223232323232333222333222323232323233223232323232323232333222323232323232332232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232322323232322323232232325335323232323232323232323232323304d3301d4912054687265616420746f6b656e206d697373696e672066726f6d20696e7075742e00330543304c301b50043034500b480094cd4c0dc034854cd4c0fc038854ccd400454cccccd4028417841788417c41784cc13ccc07d2411c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506e301c5008335506e2001303a500d3301f491124e4654206d757374206265206275726e742e005007221060105e15333333500a13304f3301f4911c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506e301c5008335506e2001303a500d3301f491124e4654206d757374206265206275726e742e005007105e2105f105e105e221060153333335009105d13304e3301e49011c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506d301b5007335506d20013039500c3304e3301e49014043616e6e6f7420636c61696d206265666f72652074696d65206475726174696f6e20676976656e20666f7220666972737420706c617965722773206d6f76652e0033350445051350433332001505848009402cc075401ccc079241124e4654206d757374206265206275726e742e0050062105e105d105d221330503302049011b4e6f74207369676e656420627920666972737420706c617965722e00335506f301d5009335506f2001303c500e3305033020490110436f6d6d6974206d69736d617463682e0033035372466e28008ccd4005220105506170657200488104526f636b0048810853636973736f727300500f33050330204901104d697373656420646561646c696e652e003335046505333502f3038500e500d301f50095333553353332001505c001003106b1533553335001153335003105f1060105f153335003105f105f10601533350031060105f105f106a10691330503302049011357726f6e67206f757470757420646174756d2e00330503303530425005500f330503332001505b303a50053507500333320015059500406b330503302049011a546f6b656e206d697373696e672066726f6d206f75747075742e00330573304f301e50063037500e48008cc08124012d5365636f6e6420706c617965722773207374616b65206d697373696e6720696e2064726177206f75747075742e00330573505d301e50063039500e1330204901124e4654206d757374206265206275726e742e005008133050330204911357726f6e67206f757470757420646174756d2e00330503303530425005500f330503332001505b303a500535075003333200150595004069330503302049011a546f6b656e206d697373696e672066726f6d206f75747075742e00330573304f301e50063037500e48008cc081240126596f75206c6f73742c2063616e6e6f742074616b65207374616b652066726f6d2067616d652e00330573505d301e50063332001505848010c0e5403854cd4c0f80348417454cccccd40204170417084cc138cc0792411c4e6f74207369676e6564206279207365636f6e6420706c617965722e00335506d301b5007335506d20013039500c3304e3301e490120466972737420706c617965722773207374616b65206973206d697373696e672e00330553505b301c50053037500c3304e3301e4901215365636f6e6420706c617965722773207374616b65206973206d697373696e672e00330553505b301c50043332001505648010c0dd4030cc138cc07924011357726f6e67206f757470757420646174756d2e003304e3303330405003500d3332001505930385003350730013304e3301e491104d697373656420646561646c696e652e003335044505133502d3036500c500a301d50073301e49011a546f6b656e206d697373696e672066726f6d206f75747075742e00330553304d301c50043035500c480084cc134cc07524011b4e6f74207369676e656420627920666972737420706c617965722e00335506c301a5006335506c20013039500b3304d3301d49014143616e6e6f7420636c61696d206265666f72652074696d65206475726174696f6e20676976656e20666f72207365636f6e6420706c617965722773206d6f76652e00333504350503504233320015057480094024c0714018cc075241124e4654206d757374206265206275726e742e005005105c22105e15335303d5001210011350724901334d6174636820726573756c7420657870656374656420627574206f757470757420646174756d20686173206e6f7468696e672e001335506a05d306b50011533533550693355302a1200122533532323304e33033303a002303a0013304e33033303900230390013304e33055303700230370013304e33055303600230360013304e33055303e002303e0013304e3232350022235003225335333573466e3c01000819018c4cc0e400c004418cc0d8008c0d4008cc138cc0c8c0d0008c0d0004cc138cc0ccc0ec008c0ec004cc138cc154c0f0008c0f0004cc138cc0ccc104008c104004cc0ccc108008c108004c0f0034c0eccd541ac178c1b00084cd41b4008004400541b14cd4c0ac01084d400488d40048888d402c88d4008888888888888ccd54c0fc4800488d400888894cd4d406088d401888c8cd40148cd401094cd4ccd5cd19b8f00200107c07b15003107b207b2335004207b25335333573466e3c0080041f01ec5400c41ec54cd400c854cd400884cd40088cd40088cd40088cd40088cc15000800481f88cd400881f88cc1500080048881f8888cd401081f88894cd4ccd5cd19b87006003081010800115335333573466e1c01400820404200044cc1e001000442000442000441e454cd4004841e441e44cd42180401801440154204040284c98c81c8cd5ce2481024c6600072135070491384e6f206f7574707574206174207468697320736372697074206164647265737320686176696e672073616d6520706172616d65746572732e00221533500110022213507449012145787065637465642065786163746c79206f6e652067616d65206f75747075742e0015335302a00321350012200113506f49011347616d6520696e707574206d697373696e672e0013304f3304732350012222222222220085001302f5006480044d400488008cccd5cd19b8735573aa0109000119910919800801801191919191919191919191919191999ab9a3370e6aae754031200023333333333332222222222221233333333333300100d00c00b00a00900800700600500400300233502602735742a01866a04c04e6ae85402ccd40980a0d5d0a805199aa8153ae502935742a012666aa054eb940a4d5d0a80419a8130179aba150073335502a03075a6ae854018c8c8c8cccd5cd19b8735573aa0049000119a8281919191999ab9a3370e6aae7540092000233505533503a75a6ae854008c0ecd5d09aba25002232632085013357380be10a021060226aae7940044dd50009aba150023232323333573466e1cd55cea80124000466a0ae66a074eb4d5d0a801181d9aba135744a004464c6410a0266ae7017c2140420c044d55cf280089baa001357426ae8940088c98c820404cd5ce02d8408083f89aab9e5001137540026ae854014cd4099d71aba150043335502a02c200135742a006666aa054eb88004d5d0a80118171aba135744a004464c640fa66ae7015c1f41ec4d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a804180f1aba135744a010464c640de66ae701241bc1b4cccd5cd19b87500948028848888880188cccd5cd19b87500a48020848888880088cccd5cd19b87500b48018848888880148cccd5cd19b87500c480108488888800c8cccd5cd19b87500d480088c8c84888888cc00402001cc130d5d09aba25010375c6ae85403c8cccd5cd19b87500e480008c84888888c01001cc130d5d09aab9e501123263207333573809a0e60e20e00de0dc0da0d826664002a09c6058a004640026068a00426664002a09a6664002a09a6056a002640026066a002640026066a00226062004260660026666ae68cdc39aab9d500b480008cccc154c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa01690001199999999998309bae35742a0166eb8d5d0a8051bad35742a0126eb4d5d0a8041bad35742a00e6464646666ae68cdc39aab9d5002480008cd541d4dd71aba15002375c6ae84d5d1280111931903d19ab9c05407a078135573ca00226ea8004d5d0a80318131aba15005375c6ae854010dd69aba15003375c6ae854008dd71aba135744a004464c640ec66ae701401d81d04d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae85402cdd71aba1500a33501704235742a01266a02e4646666ae68cdc3a800a400840be46666ae68cdc3a8012400440bc46666ae68cdc3a801a400040c0464c640dc66ae701201b81b01ac1a84d55ce9baa001357426ae8940248c98c81a4cd5ce021834833883409a8332490350543500135573ca00226ea80044d55cea80109aab9e50011375400226ae8940044d5d1280089aab9e500113754002446a004444444444444a66a666aa604824002a0464a66a666ae68cdc780700082902889a8338008a83300210829082811a800911100191a80091111111111100291299a8008821099ab9c0020411232230023758002640026aa0b2446666aae7c004941548cd4150c010d5d080118019aba200205a232323333573466e1cd55cea8012400046644246600200600460146ae854008c014d5d09aba2500223263205a3357380680b40b026aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea8012400046644246600200600460266ae854008cd4034048d5d09aba2500223263205f3357380720be0ba26aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931903099ab9c03b06105f05e05d135573aa00226ea8004d5d0a80119a804bae357426ae8940088c98c816ccd5ce01a82d82c89aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5415888c8cccd55cf80112829919a82919aa82a18031aab9d5002300535573ca00460086ae8800c1604d5d080089119191999ab9a3370ea002900011a82a18029aba135573ca00646666ae68cdc3a801240044a0a8464c640b066ae700c81601581544d55cea80089baa001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c640b066ae700c816015815415014c4d55cea80089baa001232323333573466e1cd55cea80124000466082600a6ae854008dd69aba135744a004464c640a866ae700b81501484d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e50022326320523357380580a40a026ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263205b33573806a0b60b20b00ae0ac0aa0a80a626aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931902a19ab9c02e054052051135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c8144cd5ce01582882782709aab9d50011375400224464646666ae68cdc3a800a40084a04846666ae68cdc3a8012400446a04c600c6ae84d55cf280211999ab9a3370ea00690001091100111931902919ab9c02c05205004f04e135573aa00226ea80048c8cccd5cd19b8750014800880d48cccd5cd19b8750024800080d48c98c8138cd5ce01402702602589aab9d375400224466a03466a0366a04000406666a03a6a040002066640026aa0924422444a66a00220044426600a004666aa600e2400200a00800246a002446a0044444444444446666a01a4a0a64a0a64a0a64666aa602424002a02246a00244a66a6602c00400826a0ae0062a0ac01a264246600244a66a004420062002004a084640026aa08c4422444a66a00226a00644002442666a00a440046008004666aa600e2400200a00800244a66a666ae68cdc79a801110011a800910010170168999ab9a3370e6a004440026a0024400205c05a205a44666ae68cdc780100081681611a8009111111111100291a8009111111111100311a8009111111111100411a8009111111111100491a800911100111a8009111111111100511a8009111111111100591a8009111111111100211a8009111111111100191a800911100211a8009111111111100391a800911100091a800911100191a8009111111111100111a800911111111110008919a80199a8021a80480080e19a803280400e09111a801111a801111a802911a801112999a999a8080058030010a99a8008a99a8028999a80700580180388120999a80700580180388120999a8070058018038910919800801801091091980080180109111a801111a801912999a999a8048038020010a99a8018800880f080e880f09109198008018010911191919192999a80310a999a80310a999a80410980224c26006930a999a80390980224c2600693080a08090a999a80390980224c26006930a999a80310980224c260069308098a999a80290808880908080a999a80290a999a803909802a4c26008930a999a803109802a4c2600893080988088a999a803109802a4c26008930a999a802909802a4c2600893080912999a80290a999a80390a999a80390999a8068050010008b0b0b08090a999a80310a999a80310999a8060048010008b0b0b0808880812999a80210a999a80310a999a80310999a8060048010008b0b0b08088a999a80290a999a80290999a8058040010008b0b0b0808080792999a80190a999a80290a999a80290999a8058040010008b0b0b08080a999a80210a999a80210999a8050038010008b0b0b0807880712999a80110a999a80210a999a80210999a8050038010008b0b0b08078a999a80190a999a80190999a8048030010008b0b0b08070806890911180180208911000891a80091111111003911a8009119980980200100091299a801080088089191999ab9a3370ea0029002100c11999ab9a3370ea0049001100d91999ab9a3370ea0069000100d91931901619ab9c00602c02a029028135573a6ea8005241035054310011233333333001005225335333573466e1c00800404003c401854cd4ccd5cd19b8900200101000f1004100522333573466e2000800404003c88ccd5cd19b8900200101000f22333573466e2400800403c04088ccd5cd19b8800200100f010225335333573466e2400800404003c40044008894cd4ccd5cd19b8900200101000f1002100112220031222002122200122333573466e1c00800402c028488cdc10010008912999a8010a999a8008804880408040a999a8008804080488040a999a80088040804080489119b8000200113222533500221533500221330050020011008153350012100810085001122533350021533350011006100510051533350011005100610051533350011005100510061232001333002001005005222323230010053200135501f223350014800088d4008894cd4ccd5cd19b8f00200900c00b13007001130060033200135501e223350014800088d4008894cd4ccd5cd19b8f00200700b00a1001130060031220021220014890025335335500e232323232323333333574800c46666ae68cdc39aab9d5006480008cccd55cfa8031280e11999aab9f50062501d233335573ea00c4a03c46666aae7d40189407c8cccd55cf9aba2500725335533553355335323232323232323232323232323333333574801a46666ae68cdc39aab9d500d480008cccd55cfa8069281811999aab9f500d25031233335573ea01a4a06446666aae7d4034940cc8cccd55cfa8069281a11999aab9f500d25035233335573ea01a4a06c46666aae7d4034940dc8cccd55cfa8069281c11999aab9f500d25039233335573ea01a4a07446666aae7cd5d128071299aa99aa99aa99aa99aa99aa99aa99aa99aa99aa99a98199aba15019213503d302b0011503b215335303435742a032426a07c60040022a0782a07642a66a606a6ae85406084d40f8c008004540f0540ec854cd4c0d4d5d0a80b909a81f18010008a81e0a81d90a99a981a9aba15016213503e30020011503c1503b215335323232323333333574800846666ae68cdc39aab9d5004480008cccd55cfa8021282191999aab9f500425044233335573e6ae89401494cd4c0f4d5d0a80390a99a981f1aba15007213504833550460020011504615045250450480470462504204425041250412504125041044135744a00226aae7940044dd50009aba15015213503e30020011503c1503b215335323232323333333574800846666ae68cdc39aab9d5004480008cccd55cfa8021282191999aab9f500425044233335573e6ae89401494cd4c8c8c8ccccccd5d200191999ab9a3370e6aae75400d2000233335573ea0064a09646666aae7cd5d128021299a98221aba15005213504e0011504c2504c04f04e2504a04c2504925049250492504904c135573ca00226ea8004d5d0a80390a99a981f9aba150072135048330380020011504615045250450480470462504204425041250412504125041044135744a00226aae7940044dd50009aba15014213503e30020011503c1503b215335303435742a026426a07c60040022a0782a07642a66a606a6ae85404884d40f8c008004540f0540ec854cd4c0d0d5d0a808909a81f18010008a81e0a81d90a99a981a1aba15010213503e30020011503c1503b2503b03e03d03c03b03a0390380370360350340332502f0312502e2502e2502e2502e031135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a016426a04460220022a04042a66a60326ae85402c84d408cc0080045408454080854cd4cd406c8c8c8c8ccccccd5d200211999ab9a3370ea004900211999aab9f500423502901a2502802b23333573466e1d400d2002233335573ea00a46a05403a4a05205846666ae68cdc3a8022400046666aae7d40188d40ac074940a80b4940a40ac0a80a4940989409894098940980a44d55cea80109aab9e5001137540026ae85402884d408cc0080045408454080854cd4cd406c8c8c8c8ccccccd5d200211999ab9a3370ea004900211999aab9f500423502901f2502802b23333573466e1d400d2002233335573ea00a46a05403c4a05205846666ae68cdc3a8022400046666aae7d40188d40ac080940a80b4940a40ac0a80a4940989409894098940980a44d55cea80109aab9e5001137540026ae85402484d408cc00800454084540809408008c08808408007c9406c074940689406894068940680744d5d1280089aba25001135744a00226aae7940044dd50008009080089a80aa491e446174756d20636f756c646e277420626520646573657269616c697365640022222222222123333333333300100c00b00a00900800700600500400300222221233330010050040030022212330010030021222003122200212220011222003122200212220012333333357480024a0144a0144a0144a01446a0166eb80080348ccccccd5d200092804928049280491a8051bad0022500900c1223232323333333574800846666ae68cdc3a8012400046666aae7d4010940388cccd55cf9aba2500525335300935742a00c426a0226a0220022a01e4a01e02402246666ae68cdc3a801a400446666aae7d40148d4041403c9403c0489403804003c9403094030940309403003c4d55cea80109aab9e500113754002224460040024a666a6a002444400426a00e92011e47616d65206f757470757420646f65736e2774206861766520646174756d0021001213500849012647616d65206f757470757420646f65736e2774206861766520646174756d20696e6c696e656400112200212212233001004003112212330010030021212230020031122001123263200333573800200693090008891918008009119801980100100081"

}

export const moves: Move[] = ["Rock", "Paper", "Scissors"]
export const moveToInt: Record<Move, number> = {"Rock": 0, "Paper": 1, "Scissors": 2}
export const intToMove: Record<number, Move> = {0: "Rock", 1: "Paper", 2: "Scissors"}
