import PrettyDebug exposing (toPrettyString)

import Graphics.Element as Element exposing (show, Element)
import Dict exposing (Dict)


type Fruit = Apple (List Int) | Banana (List Int)

main : Element
main =
  let
    -- x = [1,2,3]
    -- y = Dict.fromList
    --   [ ("a", 1)
    --   , ("b"
    --     , Dict.fromList [("c", 3)]
    --     )
    --   ]
    -- y = [1,2,3]
    y = [Apple [1,2,3], Banana [4,5,6]]
    -- _ = Debug.log "" (toPrettyString x)
    -- _ = Debug.log "" (toPrettyString y)
    -- _ = Debug.log "" y
    _ = PrettyDebug.log "A dict" y
  in
    show "Hello, World!"
