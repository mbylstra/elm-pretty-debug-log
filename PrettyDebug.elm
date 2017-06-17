module PrettyDebug where

import Native.PrettyDebug


toPrettyString : a -> String
toPrettyString something =
    Native.PrettyDebug.toPrettyString something

log : String -> a -> ()
log tag something =
    Native.PrettyDebug.log tag something
